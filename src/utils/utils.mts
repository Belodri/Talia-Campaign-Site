
export function randomId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


/**
 * Type-level guard: given T, resolves to `never` when T is a Function or a
 * symbol type, and to T otherwise.
 */
type Emptyable<T> = T extends Function ? never : T extends Symbol ? never : T 

/**
 * Determines whether `item` is "empty", per these rules:
 *
 *  - boolean            -> never empty
 *  - null | undefined   -> always empty
 *  - string             -> empty if trimmed length === 0
 *  - number             -> empty if 0 or NaN
 *  - bigint             -> empty if 0n
 *  - Date               -> never empty
 *  - array / Map / Set / other iterables
 *                       -> empty if it has no items, or every item is itself empty (checked recursively)
 *  - plain object       -> empty if it has no keys, or every value is itself empty (checked recursively)
 *  - function | symbol  -> never empty (excluded from T at compile time)
 */
export function isEmpty<T>(item: Emptyable<T>): boolean {
  return checkEmpty(item);
}

function checkEmpty(item: unknown): boolean {
    if (item === null || item === undefined) {
        return true;
    }

    if (typeof item === "boolean") {
        return false;
    }

    if (typeof item === "number") {
        return item === 0 || Number.isNaN(item);
    }

    if (typeof item === "bigint") {
        return item === BigInt(0);
    }

    if (typeof item === "string") {
        return item.trim().length === 0;
    }

    if (item instanceof Date) {
        return false;
    }

    if (typeof item === "function" || typeof item === "symbol") {
        return false;
    }

    if (item instanceof Map) {
        if (item.size === 0) return true;
        return item.values().every(checkEmpty);
    }

    if (item instanceof Set) {
        if (item.size === 0) return true;
        return item.values().every(checkEmpty)
    }

    if (Array.isArray(item)) {
        if (item.length === 0) return true;
        return item.every(checkEmpty);
    }

    // Any other iterable collection (e.g. a custom collection, TypedArrays, etc.)
    if (typeof item === "object" 
        && typeof (item as Iterable<unknown>)[Symbol.iterator] === "function"
    ) {
        const arr = Array.from(item as Iterable<unknown>);
        if (arr.length === 0) return true;
        return arr.every(checkEmpty);
    }

    // Plain object (or any other non-iterable object)
    if (typeof item === "object") {
        const keys = Object.keys(item as object);
        if (keys.length === 0) return true;
        return keys.every((key) =>
            checkEmpty((item as Record<string, unknown>)[key])
        );
    }

    // Fallback for anything unforeseen
    return false;
}