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
import regexDsl from "./regexDsl";

// needed for type verification and formatting
export const { INTERVAL_OBJECT_KEYS_TO_WIDTHS, INTERVAL_OBJECT_KEYS } =
    (keysAndWidths => {
        return {
            INTERVAL_OBJECT_KEYS_TO_WIDTHS: keysAndWidths.reduce(storeKeysAndWidths, {}),
            INTERVAL_OBJECT_KEYS:           keysAndWidths.map(v => v.key),
        };
        function storeKeysAndWidths(a, v) {
            a[v.key] = v.width;
            return a;
        }
    })([
        { key: "weeks",        width: 4 },      // deliberately in order of decreasing weight
        { key: "days",         width: 1 },      // so that functions depending on this ordering
        { key: "hours",        width: 2 },      // will work.
        { key: "minutes",      width: 2 },
        { key: "seconds",      width: 2 },
        { key: "milliseconds", width: 3 },
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
export const MAX_INTERVAL_MILLIS = (10 ** INTERVAL_OBJECT_KEYS_TO_WIDTHS.weeks) * MILLIS_PER_WEEK;
if (MAX_INTERVAL_MILLIS >= Number.MAX_SAFE_INTEGER) {
    throw new Error("The largest interval cannot exceed " + Number.MAX_SAFE_INTEGER + " milliseconds.");
}

export const INTERVAL_STRING_LENGTH =
    Object.entries(INTERVAL_OBJECT_KEYS_TO_WIDTHS).reduce((acc, [_, width]) => (acc + width), 0) +
    INTERVAL_OBJECT_KEYS.length - 1;

// Effectively defines an interval object/string/array.
export const isIntervalObject = x => x && typeof x === "object" && INTERVAL_OBJECT_KEYS.some(key => key in x);
export const isIntervalString = x => x && typeof x === "string" && !!x.match(REGEXP_INTERVAL_STRING);
export const isIntervalArray  = x => x && Array.isArray(x) &&
                                     x.length == INTERVAL_OBJECT_KEYS.length && x.every(Number.isFinite);

/**
 * @param {Number} interval The length of the interval, in milliseconds.
 * @returns A stopwatch-style format (`WWW:DD:HH:MM:SS.mmm`) of the given interval, as a `String`.
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
        return {
            weeks:        milliseconds[0],
            days:         milliseconds[1],
            hours:        milliseconds[2],
            minutes:      milliseconds[3],
            seconds:      milliseconds[4],
            milliseconds: milliseconds[5],
        };

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