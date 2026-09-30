import { compareAsc, trueFirst } from "../../utils/compare.mts"
import { Section } from "../reusable/Section"
import { Tab } from "../reusable/Tab"
import { FeatureCard } from "./FeatureCard"
import { ItemCard } from "./ItemCard"
import { SpellCard } from "./SpellCard"

interface ActorTabProps {
    data: JsonSchema.ActorData;
    id: string;
}

export function ActorTab({ data, id }: ActorTabProps): HTMLDivElement {
    const features = data.features.toSorted((a, b) => 
        compareAsc(a.requirements, b.requirements)
        || compareAsc(a.name, b.name));
    
    const items = data.items.toSorted((a, b) => 
        trueFirst(a.requiresAttunement, b.requiresAttunement)
        || compareAsc(a.typeLabel, b.typeLabel) 
        || compareAsc(a.name, b.name));

    const getAdjustedSpellLevel = (lvl: string) => lvl.toLowerCase() === "cantrip" ? "0" : lvl;

    const spells = data.spells.toSorted((a, b) => 
        compareAsc(getAdjustedSpellLevel(a.spellLevel), getAdjustedSpellLevel(b.spellLevel))
        || compareAsc(a.spellSchool, b.spellSchool)
        || compareAsc(a.name, b.name));

    return(
        <Tab
            id={id}
            cssClass="actor-tab"
            content={(<>
                <h1 class="actor-name-title">{data.name}</h1>
                <Section
                    title="Features"
                    content={(<>
                        {features.map(f => (<FeatureCard data={f}/>))}
                    </>)}
                />
                <Section
                    title="Items"
                    content={(<>
                        {items.map(i => (<ItemCard data={i}/>))}
                    </>)}
                />
                <Section
                    title="Spells"
                    content={(<>
                        {spells.map(s => (<SpellCard data={s}/>))}
                    </>)}
                />
            </>)}
        />
    )
}
