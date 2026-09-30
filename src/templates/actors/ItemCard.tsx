import { Raw } from "../../jsx/raw.mts";
import { isEmpty } from "../../utils/utils.mts";
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
                        <span class="label">{data.carried}</span>
                        {!isEmpty(data.stored) && <span class="parenthetical"> (+{data.stored} in storage)</span>}
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
