import { Section } from "../reusable/Section";
import { Tab } from "../reusable/Tab";
import { PageCard } from "./PageCard";

export function JournalsTab({data}: {data: JsonSchema.JournalData[]}): HTMLDivElement {
    return (
        <Tab
            cssClass="journals-tab"
            id="Journals"
            content={(<>
                {data.map(j => (<>
                    <Section
                        cssClass="journal-section"
                        title={j.name}
                        content={(<>
                            {j.pages.map(p => <PageCard data={p} />)}
                        </>)} 
                    />
                </>))}
            </>)}
        />
    )
}
