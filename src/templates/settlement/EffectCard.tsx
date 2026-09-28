import { Raw } from "../../jsx/raw.mts";
import { isEmpty } from "../../utils/utils.mts";
import { Card } from "../reusable/Card";
import { formatMutators } from "./formatters.mts";
import { TitledList } from "../reusable/TitledList";

export function EffectCard({ data }: { data: JsonSchema.SettlementEffectData; }): HTMLElement {
    const mutatorLabels = formatMutators(data.effects);

    return (
        <Card
            cssClass="building-card"
            title={data.name}
            headerInfos={(<>
                {data.remainingDays > 0 && data.remainingDays < 365
                    && <span>ends in {data.remainingDays} days</span>}
            </>)}
            content={(<>
                <div class="description">
                    <Raw html={data.flavorText} />
                </div>
                {!isEmpty(mutatorLabels) && <TitledList title="Grants" itemContents={mutatorLabels} />}
            </>)} 
        />
    );
}
