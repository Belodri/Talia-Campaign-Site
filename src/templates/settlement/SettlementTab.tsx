import { Section } from "../reusable/Section"
import { Tab } from "../reusable/Tab"
import { BuildingCard } from "./BuildingCard"
import { EffectCard } from "./EffectCard"

interface SettlementTabProps {
    data: JsonSchema.SettlementData;
    id: string;
}

export function SettlementTab({data, id}: SettlementTabProps): HTMLDivElement {
    return (
        <Tab
            cssClass="settlement-tab"
            id={id}
            content={(<>
                <div class="settlement-attributes">
                    <AttributeContainer label="Authority" value={data.attributes.authority.toString()}/>
                    <AttributeContainer label="Economy" value={data.attributes.economy.toString()}/>
                    <AttributeContainer label="Community" value={data.attributes.community.toString()}/>
                    <AttributeContainer label="Progress" value={data.attributes.progress.toString()}/>
                    <AttributeContainer label="Intrigue" value={data.attributes.intrigue.toString()}/>
                    <AttributeContainer label="Capacity" value={`${data.capacity.available}/${data.capacity.max}`}/>
                </div>
                <Section
                    cssClass="buildings-section"
                    title="Buildings"
                    content={(<>
                        {data.buildings.map(b => <BuildingCard data={b} />)}
                    </>)} 
                />
                <Section
                    cssClass="effects-section"
                    title={`Current Effects (${data.currentEffects.length})`}
                    content={(<>
                        {data.currentEffects.map(e => <EffectCard data={e} />)}
                    </>)}
                />
            </>)}
        />
    )
}

function AttributeContainer({label, value}: { label: string, value: string }): HTMLDivElement {
    return (
        <div class="attribute-container">
            <span class="attr-value">{value}</span>
            <span class="attr-label">{label}</span>
        </div>
    )
}
