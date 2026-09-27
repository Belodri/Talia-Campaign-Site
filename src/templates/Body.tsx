import { isEmpty } from "../utils/utils.mts"
import { ActorTab } from "./actors/ActorTab"
import { JournalsTab } from "./journals/JournalsTab"
import { SettlementTab } from "./settlement/SettlementTab"

interface BodyProps {
    data: JsonSchema.Schema
}

export function Body({ data }: BodyProps): HTMLBodyElement {
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
        </body>
    )
}
