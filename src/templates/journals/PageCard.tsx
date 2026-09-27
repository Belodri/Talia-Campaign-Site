import { Raw } from "../../jsx/raw.mts";
import { Card } from "../reusable/Card";

export function PageCard({ data }: { data: JsonSchema.JournalPage; }): HTMLDivElement {
    return (
        <Card
            cssClass="page-card"
            title={data.name}
            content={(<Raw html={data.htmlContent} />)} />
    );
}
