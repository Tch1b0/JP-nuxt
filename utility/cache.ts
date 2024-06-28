import { timeInMillis, TimeConfig } from "./utility";

interface CacheValue<T = unknown> {
    value: T;
    lastComputed: number;
}

const cachedValues = new Map<string, CacheValue>();

export function getTimestamp(): number {
    return new Date().getTime();
}

/**
 * cache a value that will be recomputed every `time`
 * @param name the name of the cached value
 * @param callback the callback for computing the value to be cached
 * @param time the time after which the value will be recomputed
 * @returns the requested value from cache
 * @example
 * ```js
 * let z = cacheValue(
 *  "z-calculation",
 *  () => 2 * 16,
 *  { minutes: 5 }
 * )
 * // z = 32
 * ```
 */
export async function cacheValue<T>(
    name: string,
    compute: (() => T) | (() => Promise<T>),
    time: TimeConfig,
): Promise<T> {
    const now = getTimestamp();
    let cachedVal = cachedValues.get(name) as CacheValue<T> | undefined;

    if (
        cachedVal === undefined ||
        cachedVal.lastComputed + timeInMillis(time) <= now
    ) {
        cachedVal = {
            value: await compute(),
            lastComputed: now,
        };

        cachedValues.set(name, cachedVal);
    }

    return cachedVal.value;
}
