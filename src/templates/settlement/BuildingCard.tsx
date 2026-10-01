import { isEmpty } from "../../utils/utils.mts";
import { Card } from "../reusable/Card";
import { formatMutators, formatAttributeLabels } from "./formatters.mts";
import { TitledList } from "../reusable/TitledList";
import { Checkmark } from "../reusable/Icons";


export function BuildingCard({ data }: { data: JsonSchema.SettlementBuildingData; }): HTMLElement {
    const mutatorLabels = formatMutators(data.effects);
    const requiresLabels = [
        formatAttributeLabels(data.requirements.attributes),
        data.requirements.buildings.join(", ").trim(),
        data.requirements.unlocks.join(", ").trim()
    ].filter(l => typeof l === "string" && (l as string).length);

    const isBuilt = !isEmpty(data.constructionDate);

    return (
        <Card
            cssClass="building-card"
            title={data.name}
            headerInfos={(<>
                {isBuilt && <span><Checkmark /></span>}
            </>)}
            content={(<>
                <div class="description">
                    {isBuilt && <p class="quote">Construction finished {data.constructionDate}</p>}
                    <p class="quote">{data.flavorText}</p>
                </div>
                <div class="stats">
                    <div class="titled-list">
                        <span><span class="list-title">Cost:</span> {data.scale} Capacity</span>
                    </div>
                    {!isEmpty(mutatorLabels) && <TitledList title="Grants" itemContents={mutatorLabels} />}
                    {!isEmpty(requiresLabels) && <TitledList title="Requires" itemContents={requiresLabels} />}
                </div>
            </>)}
        />
    );
}
