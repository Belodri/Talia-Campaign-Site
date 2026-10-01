import { compareAsc } from "../utils/compare.mts";
import { createId, isEmpty } from "../utils/utils.mts"
import { ActorTab } from "./actors/ActorTab"
import { JournalsTab } from "./journals/JournalsTab"
import { SettlementTab } from "./settlement/SettlementTab"

interface BodyProps {
    data: JsonSchema.Schema;
    lastUpdatedDate: Date;
}

export function Body({ data, lastUpdatedDate }: BodyProps): HTMLBodyElement {
    // Default value if client-side js isn't executed.
    const defaultLastUpdateStr = new Date()
        .toLocaleString("en-GB", { hour12: false, year: "numeric", month: "long", day: "numeric", timeZoneName: "short" });

    const actors = data.actors.toSorted((a, b) => compareAsc(a.name, b.name));

    return (
        <body>
            <header>
                <nav>
                    <menu>
                        <li>
                            <details class="dropdown">
                                <summary>Characters</summary>
                                <ul>
                                    {actors.map(a => (
                                        <li>
                                            <a href={`#${createId(a.name)}`}>{a.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        </li>
                        {!isEmpty(data.settlement) && 
                            <li>
                                <a href={`#${createId(data.settlement!.name)}`}>{data.settlement!.name}</a>
                            </li>
                        }
                        <li>
                            <a href={`#${createId("journals")}`}>Journals</a>
                        </li>
                    </menu>
                </nav>
                <span id="ingame-date-display">{data.ingameDate}</span>
            </header>

            <main>
                {actors.map(a => (<ActorTab data={a} id={createId(a.name)} />))}
                {!isEmpty(data.settlement) && <SettlementTab data={data.settlement!} id={createId(data.settlement!.name)} />}
                <JournalsTab data={data.journals} id={createId("journals")} />
            </main>

            <footer>
                <p>Last updated: <time id="last-updated-date" datetime={lastUpdatedDate.toISOString()}>{defaultLastUpdateStr}</time></p>
            </footer>
        </body>
    )
}
