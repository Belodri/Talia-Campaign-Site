import { defineConfig, type Plugin } from 'vite'
import json from "./assets/importData.json"
import { renderApp } from "./src/render.mjs"

function compileTimeRenderPlugin() : Plugin {
    return {
        name: "compile-time-render-plugin",
        transformIndexHtml(html) {
            const data: JsonSchema.Schema = json;
            return html.replace("<!-- APP CONTENT -->", renderApp(data));
        },
        configureServer(server) {
            server.watcher.add("./assets/importData.json");
            server.watcher.on("change", (file) => {
                if(file.endsWith("importData.json")) server.ws.send({ type: "full-reload" });
            });
        }
    }
}

export default defineConfig({
    oxc: {
        jsx: {
            runtime: "classic",
            pragma: "h",
            pragmaFrag: "Fragment",
        }
    },
    plugins: [ compileTimeRenderPlugin() ]
});