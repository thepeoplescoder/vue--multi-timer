import { MILLIS_PER_SECOND, MILLIS_PER_MINUTE, MILLIS_PER_HOUR, MILLIS_PER_DAY } from "./constants/time.js";
import throwNew from "./throwExpression.js";

export const now = () => (new Date()).getTime();

export const isAnIntervalObject = obj => "days"

/**
 * A class describing an actively running timer.
 * This class does not handle any tick events.  It simply encapsulates
 * an object describing an interval in time, and exposes methods that
 * let the user know if the interval has elapsed or not.
 */
export class SimpleTimer {
    #milliseconds;
    #endTime;
    #name;
    #timerPauseStartTime;

    constructor(t) {
        this.#milliseconds        = toMilliseconds(t);
        this.#name                = t.name || (this.#milliseconds + "ms timer");
        this.#timerPauseStartTime = null;

        console.log("Creating a timer running for " + this.#milliseconds + "ms.");
        console.log("Name: " + this.#name);

        this.reset();
    }

    reset() {
        this.#endTime = now();
        this.extend(this.#milliseconds);
    }

    extend(milliseconds) {
        if (!milliseconds) { return; }

        this.#endTime += typeof milliseconds === "object"
            ? toMilliseconds(milliseconds)
            : milliseconds;
    }

    timeRemainingInMilliseconds() {
        return Math.max(this.#endTime - now(), 0);
    }

    isPaused() {
        return this.#timerPauseStartTime != null;
    }

    setPaused(newState) {
        newState = !!newState;

        if (newState == this.isPaused()) { return; }

        this.#timerPauseStartTime = newState
            ? now()
            : (() => {
                this.extend(this.elapsedPauseTime());
                return null;
            })();
    }

    elapsedPauseTime() {
        return this.isPaused()
            ? now() - this.#timerPauseStartTime
            : throwNew(Error, "Cannot call this function while unpaused.");
    }

    isExpired() {
        return !this.isPaused() && this.timeRemainingInMilliseconds() <= 0;
    }

    expireEarly() {
        this.setPaused(false);
        this.#endTime = now();
    }

    getName() {
        return this.#name;
    }

    toString() {
        return intervalAsString(this.timeRemainingInMilliseconds());
    }
}

/**
 * Accepts an object describing a time interval in days, hours, minutes,
 * seconds, and milliseconds, and gives back the length of the interval
 * in milliseconds.
 * 
 * @param {Object} t An object with optional keys "days", "hours", "minutes",
 *                   "seconds", "milliseconds" mapped to numbers, describing the interval.
 * 
 * @returns The interval in milliseconds.
 */
export function toMilliseconds({ days, hours, minutes, seconds, milliseconds } = t) {
    return (milliseconds || 0) +
           (seconds      || 0) * MILLIS_PER_SECOND +
           (minutes      || 0) * MILLIS_PER_MINUTE +
           (hours        || 0) * MILLIS_PER_HOUR   +
           (days         || 0) * MILLIS_PER_DAY;
}

/**
 * Accepts a number describing an interval in milliseconds, and gives back an object
 * describing the interval in days/hours/minutes/seconds/milliseconds.
 * 
 * @param {Number} milliseconds The length of the interval, in milliseconds.
 * @returns An object describing the interval, with keys similar to `toMilliseconds`.
 */
export function dissectTime(milliseconds) {
    const days    = Math.floor(milliseconds / MILLIS_PER_DAY);      milliseconds %= MILLIS_PER_DAY;
    const hours   = Math.floor(milliseconds / MILLIS_PER_HOUR);     milliseconds %= MILLIS_PER_HOUR;
    const minutes = Math.floor(milliseconds / MILLIS_PER_MINUTE);   milliseconds %= MILLIS_PER_MINUTE;
    const seconds = Math.floor(milliseconds / MILLIS_PER_SECOND);   milliseconds %= MILLIS_PER_SECOND;

    return { days, hours, minutes, seconds, milliseconds };
}

/**
 * 
 * @param {Number} intervalInMilliseconds The length of the interval, in milliseconds.
 * @returns A stopwatch-style format of the given interval, as a `String`.
 */
export function intervalAsString(intervalInMilliseconds) {
    const t = dissectTime(intervalInMilliseconds);

    const result = [t.hours, t.minutes, t.seconds].map(v => String(v).padStart(2, "0"));

    result.unshift(String(t.days).padStart(2, "0"));
    result.push(String(t.milliseconds).padStart(3, "0"));

    return result.join(':');
}

export default {
    SimpleTimer,
    toMilliseconds,
    dissectTime,
    intervalAsString,
};