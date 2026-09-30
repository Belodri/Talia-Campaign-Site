import { defineConfig, type ViteDevServer, type Plugin, type OxcOptions } from "vite"
import path from "node:path"
import REAL_DATA from "./assets/importData.json" with { type: "json" }
import MOCK_DATA from "./assets/mockData.json" with { type: "json" }
import { pathToFileURL } from "node:url"
import { mkdir, writeFile } from "node:fs/promises"

const RENDER_SOURCE_PATH = "/src/render.mts" as const;
const RENDER_FUNC_NAME = "renderBody" as const;
const SRC_DIR_REL = "./src" as const;
const REAL_DATA_PATH_REL = "./assets/importData.json" as const;
const MOCK_DATA_PATH_REL = "./assets/mockData.json" as const;


interface Context extends RenderBodyArgs { 
    dataPath: string; 
}

const JSX_OPTS: NonNullable<OxcOptions["jsx"]> = { runtime: "classic", pragma: "h", pragmaFrag: "Fragment" } as const;


export default defineConfig(() => {
    const useMockData = process.argv.includes("--useMockData");

    // Catch type errors of imported parsed json immediately.
    // Assertion is required over plain assignment since otherwise literal unions,
    // would be rejected since TS widens them in JSON module import.
    // Assertion still catches structurally incompatible data.
    const _mockData = MOCK_DATA as JsonSchema.Schema;
    const _realData = REAL_DATA as JsonSchema.Schema;

    const context: Context = {
        data: useMockData ? _mockData : _realData,
        dataPath: useMockData ? MOCK_DATA_PATH_REL : REAL_DATA_PATH_REL,
        lastUpdatedDate: new Date()
    };

    return {
        base: "./",
        oxc: { jsx: JSX_OPTS },
        plugins: [ compileTimeRenderPlugin(context) ],
    }
});


function compileTimeRenderPlugin(ctx: Context) : Plugin {
    let devServer: ViteDevServer | undefined;
    const dataPathFileName = path.basename(ctx.dataPath);
    const srcDir = path.resolve(SRC_DIR_REL);

    return {
        name: "compile-time-render-plugin",
        async transformIndexHtml(html) {

            const renderFunc = devServer 
                ? await getDevServerRenderFunc(devServer)
                : await buildRenderFuncFromSource();

            return html.replace("<!-- APP CONTENT -->", renderFunc(ctx));
        },
        hotUpdate({ file, server }) {
            // Templates are only loaded in the ssr environment, whose hot channel doesn't reach the browser,
            // so the "(ssr) page reload" it triggers never arrives there and must be forwarded to the client.
            // (`modules` is empty for ssrLoadModule'd files, so filter by location instead.)
            if(this.environment.name === "ssr" && isInDirectory(srcDir, file))
                server.environments.client.hot.send({ type: "full-reload" });            
        },
        configureServer(server) {
            devServer = server;

            // Full reload on change in json data.
            server.watcher.add(ctx.dataPath);
            server.watcher.on("change", (changedFilePath) => {
                if(changedFilePath === dataPathFileName) server.ws.send({ type: "full-reload" });
            });
        }
    }
}


async function getDevServerRenderFunc(server: ViteDevServer): Promise<RenderBodyFunc> {
    const module = await server.ssrLoadModule(RENDER_SOURCE_PATH);
    const func = module?.[RENDER_FUNC_NAME];

    if(typeof func !== "function")
        throw new Error(`Failed to resolve render function '${RENDER_FUNC_NAME}' from module '${RENDER_SOURCE_PATH}'.`);

    return func;
}


async function buildRenderFuncFromSource(): Promise<RenderBodyFunc> {
    const { build } = await import("vite");
    const buildResult = await build({
        configFile: false,
        logLevel: "silent",
        oxc: { jsx: JSX_OPTS },
        build: {
            write: false,
            lib: {
                entry: path.resolve(path.join(import.meta.dirname, RENDER_SOURCE_PATH)),
                formats: ["es"],
                fileName: "render.mjs"
            },
            rolldownOptions: {
                external: (id) => !id.startsWith(".") && !path.isAbsolute(id),
                treeshake: {
                    moduleSideEffects: true,
                }
            }
        }
    });

    const outputOrWatcher = Array.isArray(buildResult) ? buildResult[0] : buildResult;
    if (!("output" in outputOrWatcher)) throw new Error(`${RENDER_SOURCE_PATH} library build returned a watcher instead of output`);

    const chunk = outputOrWatcher.output.find((o) => o.type === "chunk" && o.isEntry);
    if (!chunk || chunk.type !== "chunk") throw new Error(`${RENDER_SOURCE_PATH} library build produced no entry chunk.`);

    const tmpDir = path.join(process.cwd(), "node_modules", ".tmp");
    await mkdir(tmpDir, {recursive: true});

    const tmpFile = path.join(tmpDir, "render.mjs");    // Tmp file is overwritten on every build.
    await writeFile(tmpFile, chunk.code);

    const module = await import(`${pathToFileURL(tmpFile).href}?t=${Date.now()}`);
    const func = module?.[RENDER_FUNC_NAME];

    if(typeof func !== "function")
        throw new Error(`Failed to resolve render function '${RENDER_FUNC_NAME}' from module '${RENDER_SOURCE_PATH}'.`);

    return func;
}


function isInDirectory(dir: string, file: string): boolean {
    const rel = path.relative(dir, file);
    return !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}
