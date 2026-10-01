import "./jsx/factory.mts"; // Must be the first import to set 'h' and 'Fragment' on globalThis.
import { JSDOM } from "jsdom";
import { Body } from "./templates/Body";


export const renderBody: RenderBodyFunc = ({data, lastUpdatedDate}) => {
    const dom = new JSDOM("<!doctype html><html></html>");
    globalThis.document = dom.window.document;
    globalThis.Node = dom.window.Node;

    const body = Body({ data, lastUpdatedDate });
    validateHTML(body);
    return body.outerHTML;
}


function validateHTML(body: HTMLBodyElement) {
    const errors: Error[] = [];
    const addErr = (msg: string) => errors.push(new Error(msg));
    
    validate();

    if(errors.length) {
        throw new AggregateError(errors, "Generated HTML failed validation.");
    }

    function validate() {
        const ids: Set<string> = new Set();

        for(const ele of body.querySelectorAll('[id]')) {
            if(!ele.id) 
                addErr(`Declared element id is empty.`);

            if(ids.has(ele.id)) 
                addErr(`Duplicate element id '${ele.id}'.`);

            ids.add(ele.id);
        }

        for(const ele of body.querySelectorAll('a[href^="#"]')) {
            // Use the raw attribute: the `href` property resolves against the document URL (about:blank in JSDOM).
            const hrefId = ele.getAttribute("href")!.substring(1);
            if(!ids.has(hrefId))
                addErr(`Anchor contains link to nonexistent id '${hrefId}'.`);
        }
    }
}
