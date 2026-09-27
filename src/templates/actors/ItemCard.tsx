import { Raw } from "../../jsx/raw.mts";
import { Card } from "../reusable/Card";

interface ItemCardProps {
    data: JsonSchema.ItemData;
}

export function ItemCard({ data }: ItemCardProps): HTMLElement {
    return (
        <Card
            cssClass="item-card"
            title={data.name}
            headerDetails={(
                <>
                    {data.typeLabel && <span>{data.typeLabel}</span>}
                    <span>{data.quantity}</span>
                    <span>{data.inStorage ? "In Storage" : "Carried"}</span>
                    <span>{data.requiresAttunement ? "Requires Attunement" : ""}</span>
                </>
            )}
            content={(
                <>
                    <div class="description">
                        <Raw html={data.description} />
                    </div>
                </>
            )} />
    )
}
