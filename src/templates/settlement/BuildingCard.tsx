import { Raw } from "../../jsx/raw.mts";
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

    return (
        <Card
            cssClass="building-card"
            title={data.name}
            headerDetails={(<>
                {data.constructionDate && <span>Built {data.constructionDate}</span>}
                <span>{data.scale}</span>
            </>)}
            content={(<>
                <div class="description">
                    <Raw html={data.flavorText} />
                </div>
                {!isEmpty(mutatorLabels) && <TitledList title="Grants" itemContents={mutatorLabels} />}
                {!isEmpty(requiresLabels) && <TitledList title="Requirements" itemContents={requiresLabels} />}
            </>)}
        />
    );
}
