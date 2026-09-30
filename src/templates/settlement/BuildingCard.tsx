import { isEmpty } from "../../utils/utils.mts";
import { Card } from "../reusable/Card";
import { formatMutators, formatAttributeLabels } from "./formatters.mts";
import { TitledList } from "../reusable/TitledList";


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
                {isBuilt
                    ? <span><s>{data.scale}c</s></span>
                    : <span>{data.scale}c</span>}
            </>)}
            content={(<>
                <div class="description">
                    <p class="quote">{data.flavorText}</p>
                    {isBuilt && <span class="quote">Completed construction on {data.constructionDate}.</span>}
                </div>
                <div class="stats">
                    {!isEmpty(mutatorLabels) && <TitledList title="Grants" itemContents={mutatorLabels} />}
                    {!isEmpty(requiresLabels) && <TitledList title="Requires" itemContents={requiresLabels} />}
                </div>
            </>)}
        />
    );
}
