const strComparer = new Intl.Collator("en-GB", { numeric: true });

export function compareAsc<T extends string | number>(a: T, b: T): number {
    return typeof a === "string" 
        ? strComparer.compare(a, b as string)
        : (a as number) - (b as number);
}

export function compareDesc<T extends string | number>(a: T, b: T): number {
    return compareAsc(b, a);
}

export function trueFirst(a: boolean, b: boolean) {
    return (b as unknown as number) - (a as unknown as number);
}

export function falseFirst(a: boolean, b: boolean) {
    return trueFirst(b, a);
}
