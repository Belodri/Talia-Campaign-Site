import { isEmpty } from "../../utils/utils.mts"

interface CardProps {
    cssClass?: string;
    title: string;
    headerInfos?: HTMLElement | DocumentFragment;
    content: HTMLElement | DocumentFragment;
    /** Id of the card element itself. */
    id?: string;
    /** Id of the element within the card that an anchor can target to navigate to the card's content. */
    navId?: string;
}

export function Card({cssClass, title, headerInfos, content, navId, id}: CardProps): HTMLElement {
    return (
        <details id={id} class={"card" + (!isEmpty(cssClass) ? ` ${cssClass}` : "")}>
            <summary id={navId}>
                <h3 class="title card-title">{title}</h3>
                {!isEmpty(headerInfos) && <span class="card-info">{headerInfos}</span>}
            </summary>
            <div class="content card-content">
                {content}
            </div>
        </details>
    )
}
