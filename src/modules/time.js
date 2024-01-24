import { MILLIS_PER_SECOND, MILLIS_PER_MINUTE, MILLIS_PER_HOUR, MILLIS_PER_DAY, MILLIS_PER_WEEK } from "./constants/time.js";
import throwNew from "./throwExpression.js";

// this expression gets used a lot, putting into a function for readability
export const now = () => (new Date()).getTime();

// Description of an interval object.
export const INTERVAL_OBJECT_KEYS = ["weeks", "days", "hours", "minutes", "seconds", "milliseconds"];   // deliberately decreasing weight
export const isIntervalObject     = (obj => obj && typeof obj === "object" && INTERVAL_OBJECT_KEYS.some(key => key in obj));

/**
 * @param {Number} interval The length of the interval, in milliseconds.
 * @returns A stopwatch-style format of the given interval, as a `String`.
 */
export function intervalToString(interval) {
    interval = toIntervalObject(interval);

    const valueAt = key => interval[key] || 0;

    const result = INTERVAL_OBJECT_KEYS
        .filter(key => !(key in INTERVAL_OBJECT_EXTREMES))
        .map(valueAt)
        .map(value => String(value).padStart(2, "0"));

    for (const [key, arrayOperation] of Object.entries(INTERVAL_OBJECT_EXTREMES)) {
        result[arrayOperation]( String(valueAt(key)).padStart(3, "0") );
    }

    return result.join(':').replace(/:([^:]*)$/, ".$1");
}

// keys holding "extreme" values, i.e. the values that hold the least/most weight.
const INTERVAL_OBJECT_EXTREMES = {
    [INTERVAL_OBJECT_KEYS[0]]:                               "unshift",
    [INTERVAL_OBJECT_KEYS[INTERVAL_OBJECT_KEYS.length - 1]]: "push",
};

/**
 * Accepts a number describing an interval in milliseconds,
 * and gives back an interval object.
 * 
 * @param {Number} milliseconds The length of the interval, in milliseconds.  Interval objects get passed through.
 * @returns An interval object.
 */
export function toIntervalObject(milliseconds) {
    if (isIntervalObject(milliseconds)) { return milliseconds; }

    const weeks   = Math.trunc(milliseconds / MILLIS_PER_WEEK);     milliseconds %= MILLIS_PER_WEEK;
    const days    = Math.trunc(milliseconds / MILLIS_PER_DAY);      milliseconds %= MILLIS_PER_DAY;
    const hours   = Math.trunc(milliseconds / MILLIS_PER_HOUR);     milliseconds %= MILLIS_PER_HOUR;
    const minutes = Math.trunc(milliseconds / MILLIS_PER_MINUTE);   milliseconds %= MILLIS_PER_MINUTE;
    const seconds = Math.trunc(milliseconds / MILLIS_PER_SECOND);   milliseconds %= MILLIS_PER_SECOND;

    return { weeks, days, hours, minutes, seconds, milliseconds };
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
    return !isIntervalObject(interval)
        ? interval
        : (interval.milliseconds || 0) +
          (interval.seconds      || 0) * MILLIS_PER_SECOND +
          (interval.minutes      || 0) * MILLIS_PER_MINUTE +
          (interval.hours        || 0) * MILLIS_PER_HOUR   +
          (interval.days         || 0) * MILLIS_PER_DAY    +
          (interval.weeks        || 0) * MILLIS_PER_WEEK;
}

/**
 * A class describing an actively running timer.
 * This class does not handle any tick events.  It simply encapsulates
 * an object describing an interval in time, and exposes methods that
 * let the user know if the interval has elapsed or not.
 */
export class SimpleTimer {
    #lengthInMilliseconds;
    #pauseStartTimeOrUndefined;
    #endTime;
    #name;

    constructor(interval) {
        this.#lengthInMilliseconds = toMilliseconds(interval);
        this.#pauseStartTimeOrUndefined = undefined;

        this.name = isIntervalObject(interval) && interval.name;

        console.log("Creating a timer running for " + this.#lengthInMilliseconds + "ms.");
        console.log("Name: " + this.#name);

        this.reset();
    }

    set name(newName) {
        newName = (newName != null) ? String(newName) : "";
        this.#name = newName || this.#defaultName;
    }

    get name() {
        return this.#name;
    }

    get #defaultName() {
        return this.length + "ms timer";
    }

    get length() {
        return this.#lengthInMilliseconds;
    }

    reset() {
        this.isExpired = true;
        this.extend(this.length);
    }

    /**
     * Extend the timer by the given interval.
     * @param {*} interval 
     * @returns Always returns `undefined`.
     */
    extend(interval) {
        if (interval) { this.#endTime += toMilliseconds(interval) };
    }

    get timeRemainingInMillisecondsNonNegative() {
        return Math.max(this.timeRemainingInMilliseconds, 0);
    }

    get timeRemainingInMilliseconds() {
        return this.#endTime - now();
    }

    get isPaused() {
        return this.#pauseStartTimeOrUndefined != undefined;
    }

    set isPaused(newState) {
        newState = !!newState;
        if (newState == this.isPaused) { return; }

        this.#pauseStartTimeOrUndefined = newState ? now() : this.extend(this.elapsedPauseTime);
    }

    get elapsedPauseTime() {
        return this.isPaused
            ? now() - this.#pauseStartTimeOrUndefined
            : throwNew(Error, "" + this.#pauseStartTimeOrUndefined + " while unpaused");
    }

    get isExpired() {
        return !this.isPaused && this.timeRemainingInMilliseconds <= 0;
    }

    /**
     * Setting this to `false` makes no sense.  To "unexpire" a timer, `extend` it.
     */
    set isExpired(expired) {
        if (expired) {
            this.isPaused = false;
            this.#endTime = now();
        }
    }

    toString() {
        return intervalToString(this.timeRemainingInMillisecondsNonNegative);
    }
}

export default {
    SimpleTimer,
    toMilliseconds,
    toIntervalObject,
    intervalToString,
};