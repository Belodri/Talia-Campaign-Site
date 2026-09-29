import type  { Props, ComponentFn, Child } from "../../types/global";

// Uses the ambient `document`

globalThis.h = HFn;
globalThis.Fragment = FragmentFn;

function HFn(tag: typeof FragmentFn, props: Props, ...children: Child[]): DocumentFragment;
function HFn<K extends keyof HTMLElementTagNameMap>(tag: K | ComponentFn<K>, props: Props, ...children: Child[]): HTMLElementTagNameMap[K];
function HFn(tag: ((props: Props) => Node), props: Props, ...children: Child[]): Node;
function HFn<K extends keyof HTMLElementTagNameMap>(
    tag: K | ComponentFn<K> | typeof FragmentFn | ((props: Props) => Node), props: Props, ...children: Child[]
): Node {
    if (tag === FragmentFn) {
        return FragmentFn({ ...(props ?? {}), children });
    }

    if (typeof tag === "function") {
        return tag({ ...(props ?? {}), children });
    }

    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props ?? {})) {
        if (key === "children") {
            continue;
        }

        if (value === undefined || value === null) {
            continue;
        }

        if (key === "className" || key === "class") {
            el.className = String(value);
        }
        else if (value === true) {
            el.setAttribute(key, "");
        }
        else {
            el.setAttribute(key, String(value));
        }
    }

    appendChildren(el, children);

    return el;
}

function FragmentFn(props: { children?: Child[] }): DocumentFragment {
    const frag = document.createDocumentFragment();
    appendChildren(frag, props.children ?? []);
    return frag;
}

function appendChildren(parent: Node, children: Child[]): void {
    for (const child of children) {
        // JSX convention holds that boolean/null/undefined don't render.
        if (child === null || child === undefined || typeof(child) === "boolean") continue;

        if(typeof child === "string") parent.appendChild(document.createTextNode(child));
        else if (Array.isArray(child)) appendChildren(parent, child);
        else if (child instanceof Node) parent.appendChild(child);
        else parent.appendChild(document.createTextNode(String(child)));
    }
}
