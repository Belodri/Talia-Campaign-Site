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
            headerInfos={(
                <>
                    <span>{data.typeLabel}</span>
                    <span>{data.quantity} {data.inStorage ? "(storage)" : "(backpack)"}</span>
                    {data.requiresAttunement && <span>Requires Attunement</span>}
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
