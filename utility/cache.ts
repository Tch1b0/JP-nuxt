import { timeInMillis, TimeConfig } from "./utility";

interface CacheValue<T> {
    value: T;
    lastComputed: number;
}

const cachedValues = new Map<string, CacheValue<unknown>>();

export function getTimestamp(): number {
    return new Date().getTime();
}

export async function cacheValue<T>(
    name: string,
    callback: (() => T) | (() => Promise<T>),
    time: TimeConfig,
): Promise<T> {
    const now = getTimestamp();
    let cachedVal = cachedValues.get(name) as CacheValue<T> | undefined;

    if (
        cachedVal === undefined ||
        cachedVal.lastComputed + timeInMillis(time) <= now
    ) {
        cachedVal = {
            value: await callback(),
            lastComputed: now,
        };

        cachedValues.set(name, cachedVal);
    }

    return cachedVal.value;
}
