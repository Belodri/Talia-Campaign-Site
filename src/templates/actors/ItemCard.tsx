import { Raw } from "../../jsx/raw.mts";
import { isEmpty } from "../../utils/utils.mts";
import { Card } from "../reusable/Card";
import { Backpack, Chest } from "../reusable/Icons";

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
                        {data.requiresAttunement && <span class="parenthetical"> (req. attunement)</span>}
                    </span>
                    <span>
                        <span class="label">{data.carried} <Backpack /> / {data.stored} <Chest /></span>
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
