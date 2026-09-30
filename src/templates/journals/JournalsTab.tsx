import { compareAsc } from "../../utils/compare.mts";
import { createId } from "../../utils/utils.mts";
import { Section } from "../reusable/Section";
import { Tab } from "../reusable/Tab";
import { PageCard } from "./PageCard";

interface JournalsTabProps {
    data: JsonSchema.JournalData[];
    id: string;
}

export function JournalsTab({data, id}: JournalsTabProps): HTMLDivElement {
    const journals = data.toSorted((a, b) => compareAsc(a.name, b.name))
        .filter(j => j.pages.length);

    return (
        <Tab
            cssClass="journals-tab"
            id={id}
            content={(<>
                {journals.map(j => (<>
                    <Section
                        navId={createId([id, j.name])}
                        cssClass="journal-section"
                        title={j.name}
                        content={(<>
                            {j.pages
                                .toSorted((a, b) => compareAsc(a.index, b.index))
                                .map(p => (
                                <PageCard
                                    data={p}
                                    navId={createId([id, j.name, p.name])} />
                            ))}
                        </>)}
                    />
                </>))}
            </>)}
        />
    )
}
