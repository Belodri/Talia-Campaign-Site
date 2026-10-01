interface SectionProps {
    cssClass?: string;
    title: string;
    content: HTMLElement | DocumentFragment;
    /** Id of the element itself. */
    id?: string;
    /** Id of the element within the section that an anchor can target to navigate to the section's content. */
    navId?: string;
}

export function Section({ cssClass, title, content, navId, id }: SectionProps): HTMLElement {
    return (
        <section class={cssClass} id={id}>
            <details>
                <summary id={navId}>
                    <h2 class="title section-title">{title}</h2>
                </summary>
                <div class="content section-content">
                    {content}
                </div>
            </details>
        </section>
    );
}
