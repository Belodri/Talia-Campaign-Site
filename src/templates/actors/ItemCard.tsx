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
                    <span>
                        <span class="label">{data.typeLabel}</span>
                        {data.requiresAttunement && <span class="parenthetical"> (requires attunement)</span>}
                    </span>
                    <span>
                        <span class="label">{data.quantity}</span>
                        {data.inStorage && <span class="parenthetical"> (in Storage)</span>}
                    </span>
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
