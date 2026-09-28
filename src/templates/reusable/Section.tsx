interface SectionProps {
    cssClass?: string,
    title: string,
    content: HTMLElement | DocumentFragment,
}

export function Section({ cssClass, title, content }: SectionProps): HTMLDivElement {
    return (
        <section class={cssClass}>
            <details>
                <summary>
                    <h2 class="title section-title">{title}</h2>
                </summary>
                <div class="content section-content">
                    {content}
                </div>
            </details>
        </section>
    );
}
