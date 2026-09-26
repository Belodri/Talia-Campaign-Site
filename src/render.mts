import "./jsx/factory.mts"; // Must be the first import to set 'h' and 'Fragment' on globalThis.
import { JSDOM } from "jsdom";

export function renderApp(data: JsonSchema.Schema): string {
    const dom = new JSDOM("<!doctype html><html><body></body></html>");
    (globalThis as unknown as { document: Document }).document = dom.window.document;

    return "";
}