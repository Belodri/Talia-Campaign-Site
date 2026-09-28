export { Props, ComponentFn, Child };

type Props = Record<string, unknown> | null;
type ComponentFn<K extends keyof HTMLElementTagNameMap> = (props: Props) => HTMLElementTagNameMap[K];
type Child = string | Node | HTMLElementTagNameMap[keyof HTMLElementTagNameMap] | boolean | null | undefined | Child[];

declare function FragmentFn(props: { children?: Child[] }): DocumentFragment;

declare function HFn(tag: typeof FragmentFn, props: Props, ...children: Child[]): DocumentFragment;
declare function HFn<K extends keyof HTMLElementTagNameMap>(tag: K | ComponentFn<K>, props: Props, ...children: Child[]): HTMLElementTagNameMap[K];
declare function HFn(tag: ((props: Props) => Node), props: Props, ...children: Child[]): Node;
declare function HFn<K extends keyof HTMLElementTagNameMap>(tag: K | ComponentFn<K> | typeof FragmentFn | ((props: Props) => Node), props: Props, ...children: Child[]): Node;

declare global {
    var h: typeof HFn;
    var Fragment: typeof FragmentFn;

    namespace JSX {
        interface IntrinsicElements {
            div: { class?: string, id?: string, "data-toggle-id"?: string };
            span: { class?: string, id?: string };
            menu: { class?: string, id?: string };
            button: { class?: string, id?: string, "data-toggle-id"?: string };
            header: { class?: string, id?: string };
            nav: {};
            body: {};
            main: {};
            footer: {};
            time: { id?: string, datetime: string };
            section: { class?: string, id?: string };
            h1: { class?: string, id?: string };
            h2: { class?: string, id?: string, "data-toggle-id"?: string };
            p: { class?: string, id?: string };
            ul: { class?: string, id?: string };
            li: { class?: string, id?: string, tabIndex?: number };
        }
    }
}