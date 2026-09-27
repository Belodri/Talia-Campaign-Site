import { randomId } from "../../utils/utils.mjs";

interface CardProps {
    cssClass?: string,
    title: string,
    headerDetails?: HTMLElement | DocumentFragment,
    content: HTMLElement | DocumentFragment
}

export function Card({cssClass, title, headerDetails, content}: CardProps): HTMLDivElement {
    const id = randomId();

    return (
        <div class={"card" + cssClass?.length ? ` ${cssClass}` : ""}>
            <div class="header card-header" data-toggle-id={id}>
                <h2 class="title card-title">{title}</h2>
                {headerDetails !== null && <div class="details card-details">{headerDetails}</div>}
            </div>
            <div class="content card-content" id={id}>
                {content}
            </div>
        </div>
    )
}