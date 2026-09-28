import { isEmpty } from "../utils/utils.mts"
import { ActorTab } from "./actors/ActorTab"
import { JournalsTab } from "./journals/JournalsTab"
import { SettlementTab } from "./settlement/SettlementTab"

interface BodyProps {
    data: JsonSchema.Schema,
    lastUpdated: Temporal.Instant
}

export function Body({ data, lastUpdated }: BodyProps): HTMLBodyElement {
    // Default value if client-side js isn't executed.
    const defaultLastUpdateStr = lastUpdated
        .toZonedDateTimeISO("UTC")
        .toLocaleString("en-GB", { hour12: false, year: "numeric", month: "long", day: "numeric", timeZoneName: "short" });

    return (
        <body>
            <header>
                <nav>
                    <menu>
                        <li class="menu-entry dropdown-hover" tabIndex={0}>
                            <button class="menu-button dropdown-button">Characters</button> 
                            <ul class="dropdown-menu">
                                {data.actors.map(a => (
                                    <li>
                                        <button class="menu-button action-button" data-toggle-id={a.name}>{a.name}</button>
                                    </li>))}
                            </ul>
                        </li>
                        {!isEmpty(data.settlement) && 
                            <li class="menu-entry" tabIndex={1}>
                                <button class="menu-button action-button" data-toggle-id={data.settlement!.name}>{data.settlement!.name}</button>
                            </li>
                        }
                        <li class="menu-entry" tabIndex={2}>
                            <button class="menu-button action-button" data-toggle-id="Journals">Journals</button>
                        </li>
                    </menu>
                </nav>
                <span id="ingame-date-display">{data.ingameDate}</span>
            </header>

            <main>
                {data.actors.map(a => (<ActorTab data={a} />))}
                {!isEmpty(data.settlement) && <SettlementTab data={data.settlement!} />}
                <JournalsTab data={data.journals} />
            </main>

            <footer>
                <p>Last updated: <time datetime={lastUpdated.toString()}>{defaultLastUpdateStr}</time></p>
            </footer>
        </body>
    )
}
