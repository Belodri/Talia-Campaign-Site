import { Raw } from "../../jsx/raw.mts";
import { Card } from "../reusable/Card";

interface PageCardProps {
    data: JsonSchema.JournalPage;
    navId?: string;
}

export function PageCard({ data, navId }: PageCardProps): HTMLDivElement {
    return (
        <Card
            navId={navId}
            cssClass="page-card"
            title={data.name}
            content={(<Raw html={data.htmlContent} />)} />
    );
}
