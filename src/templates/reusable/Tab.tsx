interface TabProps {
    id: string;
    content: HTMLElement | DocumentFragment;
    cssClass?: string;
}

export function Tab({ id, content, cssClass }: TabProps): HTMLDivElement {
    return (
        <div class={cssClass ? `tab  ${cssClass}` : "tab"} id={id}>
            {content}
        </div>
    );
}
