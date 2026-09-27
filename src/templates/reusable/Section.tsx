import { randomId } from "../../utils/utils.mts";

interface SectionProps {
    cssClass?: string,
    title: string,
    content: HTMLElement | DocumentFragment,
}

export function Section({ cssClass, title, content }: SectionProps): HTMLDivElement {
    const id = randomId();

    return (
        <section class={cssClass}>
            <div class="section-header" data-toggle-id={id}>
                <h2 class="section-title">{title}</h2>
            </div>
            <div class="section-content" id={id}>
                {content}
            </div>
        </section>
    );
}
