interface TabProps {
    id: string;
    content: HTMLElement | DocumentFragment;
    addClass?: string;
}

export function Tab({ id, content, addClass }: TabProps): HTMLDivElement {
    return (
        <div class={addClass ? `tab  ${addClass}` : "tab"} id={id}>
            {content}
        </div>
    );
}
