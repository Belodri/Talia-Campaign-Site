import "./jsx/factory.mts"; // Must be the first import to set 'h' and 'Fragment' on globalThis.
import { JSDOM } from "jsdom";
import { Body } from "./templates/Body";

export function renderApp(data: JsonSchema.Schema): string {
    const dom = new JSDOM("<!doctype html><html></html>");
    globalThis.document = dom.window.document;
    globalThis.Node = dom.window.Node;
    return Body({ data }).outerHTML;
}
