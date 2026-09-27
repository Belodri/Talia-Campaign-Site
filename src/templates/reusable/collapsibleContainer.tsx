import { randomId } from "../../utils/utils.mjs";

interface CollapsibleContainerProps {
    collapsed?: boolean,
    addClass?: string,
    headerContent: HTMLElement | DocumentFragment,
    contentContent: HTMLElement | DocumentFragment,
}

export function CollapsibleContainer({collapsed = true, addClass, headerContent, contentContent}: CollapsibleContainerProps): HTMLDivElement {
    const id = randomId();

    return (
        <div class={addClass ? `collapsible-container  ${addClass}` : "collapsible-container"}>
            <div class="collapsible-header" data-toggle-id={id}>
                {headerContent}
            </div>
            <div class={collapsed ? "collapsible-content hidden" : "collapsible-content"} id={id}>
                {contentContent}
            </div>
        </div>
    )
}
