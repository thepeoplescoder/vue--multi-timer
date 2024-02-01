/**
 * For the purposes of this app, interval objects are plain JavaScript objects that describe an interval
 * of time, and they can contain any of the following keys:
 * 
 *      weeks
 *      days
 *      hours
 *      minutes
 *      seconds
 *      milliseconds
 * 
 * All fields are optional, but at least one must exist.
 */

import { MILLIS_PER_SECOND, MILLIS_PER_MINUTE, MILLIS_PER_HOUR, MILLIS_PER_DAY, MILLIS_PER_WEEK } from "./constants/time";
import { SECONDS_PER_MINUTE, MINUTES_PER_HOUR, HOURS_PER_DAY, DAYS_PER_WEEK } from "./constants/time";
import regexDsl from "./regexDsl";

// needed for type verification, formatting, and value checking
const WEEKS_WIDTH = 4;
export const { INTERVAL_OBJECT_KEYS_TO_WIDTHS, INTERVAL_OBJECT_KEYS, INTERVAL_KEY_MAX } =
    (table => {
        function storeFromTable(keyProp, valueProp) {
            return (a, v) => {
                a[v[keyProp]] = v[valueProp];
                return a;
            }
        }

        const result = {
            INTERVAL_OBJECT_KEYS_TO_WIDTHS: table.reduce(storeFromTable("key", "width"), {}),
            INTERVAL_OBJECT_KEYS:           table.map(v => v.key),
        };

        result.INTERVAL_KEY_MAX = table.reduce(storeFromTable("key", "max"), {});

        return result;
    })([
        { key: "weeks",        max: 10 ** WEEKS_WIDTH - 1,  width: WEEKS_WIDTH },   // deliberately in order of decreasing weight
        { key: "days",         max: DAYS_PER_WEEK - 1,      width: 1           },   // so that functions depending on this ordering
        { key: "hours",        max: HOURS_PER_DAY - 1,      width: 2           },   // will work.
        { key: "minutes",      max: MINUTES_PER_HOUR - 1,   width: 2           },
        { key: "seconds",      max: SECONDS_PER_MINUTE - 1, width: 2           },
        { key: "milliseconds", max: 0,                      width: 3           },
    ]);

// needed for type verification
export const REGEXP_INTERVAL_STRING = (() => {
    const { BEGIN, END, DIGIT, REPEAT, LITERAL, } = regexDsl;

    return new RegExp([
        BEGIN.STRING,
        DIGIT, REPEAT(INTERVAL_OBJECT_KEYS_TO_WIDTHS.weeks).TIMES,
        LITERAL(':'),
        DIGIT, REPEAT(INTERVAL_OBJECT_KEYS_TO_WIDTHS.days).TIMES,
        LITERAL(':'),
        DIGIT, REPEAT(INTERVAL_OBJECT_KEYS_TO_WIDTHS.hours).TIMES,
        LITERAL(':'),
        DIGIT, REPEAT(INTERVAL_OBJECT_KEYS_TO_WIDTHS.minutes).TIMES,
        LITERAL(':'),
        DIGIT, REPEAT(INTERVAL_OBJECT_KEYS_TO_WIDTHS.seconds).TIMES,
        LITERAL('.'),
        DIGIT, REPEAT(INTERVAL_OBJECT_KEYS_TO_WIDTHS.milliseconds).TIMES,
        END.STRING,
    ].join(""));
})();

// code is documentation.
export const MAX_INTERVAL_MILLIS_EXCLUSIVE = (INTERVAL_KEY_MAX.weeks + 1) * MILLIS_PER_WEEK;
if (MAX_INTERVAL_MILLIS_EXCLUSIVE >= Number.MAX_SAFE_INTEGER) {
    throw new Error("The largest interval cannot be " + Number.MAX_SAFE_INTEGER + " milliseconds or greater.");
}

export const INTERVAL_STRING_LENGTH =
    Object.entries(INTERVAL_OBJECT_KEYS_TO_WIDTHS).reduce(  (acc, [_, width]) => (acc + width), 0  ) +
    INTERVAL_OBJECT_KEYS.length - 1;

// Effectively defines an interval object/string/array.
export const isIntervalObject = x => x && typeof x === "object" && INTERVAL_OBJECT_KEYS.some(key => key in x);
export const isIntervalString = x => x && typeof x === "string" && !!x.match(REGEXP_INTERVAL_STRING);
export const isIntervalArray  = x => x && Array.isArray(x) &&
                                     x.length == INTERVAL_OBJECT_KEYS.length && x.every(Number.isFinite);

/**
 * @param {Number} interval The length of the interval, in milliseconds.
 * @returns A stopwatch-style format (`WWWW:D:HH:MM:SS.mmm`) of the given interval, as a `String`.
 */
export function intervalToString(interval) {
    interval = toIntervalObject(interval);

    const _valueOf = (key => interval[key] || 0);

    const result = INTERVAL_OBJECT_KEYS.map(
        key => String(_valueOf(key)).padStart(INTERVAL_OBJECT_KEYS_TO_WIDTHS[key], "0"));

    return result.join(':')
        .replace(/:([^:]*)$/, ".$1");   // this regex operation means: replace the last colon with a dot
}

/**
 * Accepts a number describing an interval in milliseconds,
 * and gives back an interval object.
 * 
 * @param {Number} milliseconds The length of the interval, in milliseconds.  Interval objects get passed through.
 * @returns An interval object.  All fields (weeks/days/hours/minutes/seconds) will exist.
 */
export function toIntervalObject(milliseconds) {
    if (Number.isFinite(milliseconds)) {
        const weeks   = Math.trunc(milliseconds / MILLIS_PER_WEEK);     milliseconds %= MILLIS_PER_WEEK;
        const days    = Math.trunc(milliseconds / MILLIS_PER_DAY);      milliseconds %= MILLIS_PER_DAY;
        const hours   = Math.trunc(milliseconds / MILLIS_PER_HOUR);     milliseconds %= MILLIS_PER_HOUR;
        const minutes = Math.trunc(milliseconds / MILLIS_PER_MINUTE);   milliseconds %= MILLIS_PER_MINUTE;
        const seconds = Math.trunc(milliseconds / MILLIS_PER_SECOND);   milliseconds %= MILLIS_PER_SECOND;

        return { weeks, days, hours, minutes, seconds, milliseconds };

    } else if (isIntervalArray(milliseconds)) {
        return INTERVAL_OBJECT_KEYS.reduce((acc, v, i) => ((acc[v] = milliseconds[i]), acc), {});

    } else if (isIntervalObject(milliseconds)) {
        return milliseconds;
    }

    throw new TypeError("milliseconds must be an interval object, an interval array, or a finite number.");
}

export function toIntervalArray(interval) {
    if (isIntervalArray(interval)) { return interval; }
    interval = toIntervalObject(interval);
    return INTERVAL_OBJECT_KEYS.map(key => interval[key] || 0);
}

export function intervalStringToArray(s) {
    s = s.toString();

    if (!isIntervalString(s)) {
        throw new TypeError("not an interval string");
    }

    s = s.split(':');
    s.push(...s.pop().split('.'));
    s = s.map(Number);

    return s;
}

/**
 * Accepts an interval object, and gives back the length of the interval
 * in milliseconds.
 * 
 * @param {Object} interval An object with optional keys "weeks", "days", "hours", "minutes",
 *                          "seconds", "milliseconds" mapped to numbers, describing the interval.
 * 
 * @returns The interval in milliseconds.
 */
export function toMilliseconds(interval) {
    if (Number.isFinite(interval)) {
        return interval;
    }

    interval = toIntervalObject(interval);

    return (interval.milliseconds || 0) +
           (interval.seconds      || 0) * MILLIS_PER_SECOND +
           (interval.minutes      || 0) * MILLIS_PER_MINUTE +
           (interval.hours        || 0) * MILLIS_PER_HOUR   +
           (interval.days         || 0) * MILLIS_PER_DAY    +
           (interval.weeks        || 0) * MILLIS_PER_WEEK;
}

export default {
    INTERVAL_OBJECT_KEYS, intervalToString, isIntervalObject, toIntervalObject, toMilliseconds,
    isIntervalArray, isIntervalString, REGEXP_INTERVAL_STRING, intervalStringToArray,
};
