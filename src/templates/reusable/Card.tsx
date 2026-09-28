import { isEmpty } from "../../utils/utils.mts"

interface CardProps {
    cssClass?: string,
    title: string,
    headerInfos?: HTMLElement | DocumentFragment,
    content: HTMLElement | DocumentFragment
}

export function Card({cssClass, title, headerInfos, content}: CardProps): HTMLDivElement {
    return (
        <details class={"card" + cssClass?.length ? ` ${cssClass}` : ""}>
            <summary>
                <h3 class="title card-title">{title}</h3>
                {!isEmpty(headerInfos) && <span class="card-info">{headerInfos}</span>}
            </summary>
            <div class="content card-content">
                {content}
            </div>
        </details>
    )
}
