import { defineConfig, ViteDevServer, type Plugin } from 'vite'
import path from 'node:path'
import json from "./assets/importData.json" with { type: "json" }
import { pathToFileURL } from 'node:url'
import { mkdir, unlink, writeFile } from 'node:fs/promises'

const JSX_OPTS = {
    runtime: "classic" as const,
    pragma: "h",
    pragmaFrag: "Fragment"
}

function compileTimeRenderPlugin() : Plugin {
    let devServer: ViteDevServer | undefined;

    async function renderHtml(): Promise<string> {
        const data: JsonSchema.Schema = json;

        if(devServer) {
            const mod = await devServer.ssrLoadModule("/src/render.mts");
            return mod.renderApp(data);
        }

        const { build } = await import("vite");
        const result = await build({
            configFile: false,
            logLevel: "silent",
            oxc: { jsx: JSX_OPTS },
            build: {
                write: false,
                lib: {
                    entry: path.resolve(import.meta.dirname, "src/render.mts"),
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

        
        // @ts-expect-error
        const output = Array.isArray(result) ? result[0].output : result.output;
        // @ts-expect-error
        const chunk = output.find((o) => o.type === 'chunk' && o.isEntry)
        if (!chunk || chunk.type !== 'chunk') throw new Error('render.mts library build produced no entry chunk');

        const tmpDir = path.join(process.cwd(), "node_modules", ".tmp");
        await mkdir(tmpDir, {recursive: true});
        const tmpFile = path.join(tmpDir, `render-${Date.now()}.mjs`);
        await writeFile(tmpFile, chunk.code);
        try {
            const mod = await import(pathToFileURL(tmpFile).href);
            return mod.renderApp(data, Temporal.Now.instant());
        } finally {
            await unlink(tmpFile);
        }
    }

    

    return {
        name: "compile-time-render-plugin",
        async transformIndexHtml(html) {
            return html.replace("<!-- APP CONTENT -->", await renderHtml());
        },
        configureServer(server) {
            devServer = server;
            server.watcher.add("./assets/importData.json");
            server.watcher.on("change", (file) => {
                if(file.endsWith("importData.json")) server.ws.send({ type: "full-reload" });
            });
        }
    }
}

export default defineConfig({
    oxc: { jsx: JSX_OPTS },
    plugins: [ compileTimeRenderPlugin() ]
});