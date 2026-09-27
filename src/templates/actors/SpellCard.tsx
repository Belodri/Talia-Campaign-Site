import { Raw } from "../../jsx/raw.mts";
import { Card } from "../reusable/Card";

interface SpellCardProps {
    data: JsonSchema.SpellData;
}

export function SpellCard({ data }: SpellCardProps): HTMLElement {
    return (
        <Card
            cssClass="spell-card"
            title={data.name}
            headerDetails={(
                <>
                    <span>{data.spellLevel}</span>
                    <span>{data.spellSchool}</span>
                    <span>{data.range}</span>
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
