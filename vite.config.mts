import { defineConfig, type ViteDevServer, type Plugin, type OxcOptions } from "vite"
import path from "node:path"
import REAL_DATA from "./assets/importData.json" with { type: "json" }
import MOCK_DATA from "./assets/mockData.json" with { type: "json" }
import { pathToFileURL } from "node:url"
import { mkdir, writeFile } from "node:fs/promises"

const RENDER_SOURCE_PATH = "/src/render.mts" as const;
const RENDER_FUNC_NAME = "renderBody" as const;
const REAL_DATA_PATH = "./assets/importData.json" as const;
const MOCK_DATA_PATH = "./assets/mockData.json" as const;


interface Context extends RenderBodyArgs { 
    dataPath: string; 
}

const JSX_OPTS: NonNullable<OxcOptions["jsx"]> = { runtime: "classic", pragma: "h", pragmaFrag: "Fragment" } as const;


export default defineConfig(() => {
    const useMockData = process.argv.includes("--useMockData");

    // Catch type errors of imported parsed json immediately.
    const context: Context = {
        data: useMockData ? MOCK_DATA : REAL_DATA,
        dataPath: useMockData ? MOCK_DATA_PATH : REAL_DATA_PATH,
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

    return {
        name: "compile-time-render-plugin",
        async transformIndexHtml(html) {

            const renderFunc = devServer 
                ? await getDevServerRenderFunc(devServer)
                : await buildRenderFuncFromSource();

            return html.replace("<!-- APP CONTENT -->", renderFunc(ctx));
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
