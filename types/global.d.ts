export { Props, ComponentFn, Child };

type Props = Record<string, unknown> | null;
type ComponentFn<K extends keyof HTMLElementTagNameMap> = (props: Props) => HTMLElementTagNameMap[K];
type Child = string | Node | HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

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
            div: { className?: string, id?: string };
            section: { className?: string, id?: string };
            h1: { className?: string, id?: string };
            h2: { className?: string, id?: string };
            p: { className?: string, id?: string };
            ul: { className?: string, id?: string };
            li: { className?: string, id?: string };
        }
    }
}