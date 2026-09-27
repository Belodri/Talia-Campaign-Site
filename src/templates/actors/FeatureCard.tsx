import { Raw } from "../../jsx/raw.mts";
import { Card } from "../reusable/Card";

interface FeatureCardProps {
    data: JsonSchema.FeatureData;
}

export function FeatureCard({ data }: FeatureCardProps): HTMLElement {
    return (
        <Card
            cssClass="feature-card"
            title={data.name}
            headerDetails={(
                <>
                    <span>{data.requirements}</span>
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
