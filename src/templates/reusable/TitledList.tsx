interface TitledListProps {
    title: string;
    itemContents: HTMLElement[] | string[];
}

export function TitledList({ title, itemContents }: TitledListProps): HTMLDivElement {
    return (
        <div class="titled-list">
            <span class="list-title">{title}</span>
            <ul>
                {itemContents.map(c => (<li>{c}</li>))}
            </ul>
        </div>
    );
}
