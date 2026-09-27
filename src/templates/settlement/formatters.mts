export function formatMutators(mutators: JsonSchema.SettlementMutator): string[] {
    const attrLabel = formatAttributeLabels(mutators.modifiers.attributes);

    return [
        attrLabel,
        formatLabel("Capacity", mutators.modifiers.capacity),
        mutators.other
    ].filter(i => i?.length && typeof i === "string") as string[];
}

export function formatAttributeLabels(attr: JsonSchema.SettlementAttributes): string {
    return [
        formatLabel("Authority", attr.authority),
        formatLabel("Economy", attr.economy),
        formatLabel("Community", attr.community),
        formatLabel("Progress", attr.progress),
        formatLabel("Intrigue", attr.intrigue),
    ].filter(Boolean).join(", ").trim();
}

function formatLabel(label: string, num: number): string | undefined {
    if(num !== 0) return `${num > 0 ? "+" : ""}${num} ${label}`;
}