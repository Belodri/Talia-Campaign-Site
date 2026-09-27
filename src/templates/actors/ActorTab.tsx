import { Section } from "../reusable/Section"
import { Tab } from "../reusable/Tab"
import { FeatureCard } from "./FeatureCard"
import { ItemCard } from "./ItemCard"
import { SpellCard } from "./SpellCard"

interface ActorTabProps {
    data: JsonSchema.ActorData
}

export function ActorTab({ data }: ActorTabProps): HTMLDivElement {
    return(
        <Tab
            id={data.name}
            cssClass="actor-tab"
            content={(<>
                <h1 class="actor-name-title">{data.name}</h1>
                <Section
                    title="Features"
                    content={(<>
                        {data.features.map(f => (<FeatureCard data={f}/>))}
                    </>)}
                />
                <Section
                    title="Items"
                    content={(<>
                        {data.physicalItems.map(i => (<ItemCard data={i}/>))}
                    </>)}
                />
                <Section
                    title="Spells"
                    content={(<>
                        {data.spells.map(s => (<SpellCard data={s}/>))}
                    </>)}
                />
            </>)}
        />
    )
}
