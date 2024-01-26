import now from "./now.js";
import { toMilliseconds, toIntervalObject, intervalToString } from "./intervalObjects.js";
import { isIntervalObject, isIntervalString } from "./intervalObjects.js";
import { intervalStringToArray } from "./intervalObjects.js";

// Vue doesn't support private class fields.
// Apparently they don't play well with proxies.
// By convention, I'll prefix those fields with a double underscore.
// See issue: https://github.com/vuejs/core/issues/8149

/**
 * A class describing an actively running timer.
 * This class does not handle any tick events.  It simply encapsulates
 * an object describing an interval in time, and exposes methods that
 * let the user know if the interval has elapsed or not.
 */
export class SimpleTimer {
    static INSTANCE_FIELDS = Object.keys(
        new SimpleTimer({
            milliseconds: 0.01,
            name:         "__dummy_timer_to_get_instance_fields_of_a_proper_object__.__this_will_be_garbage_collected__",
        })
    );

    get isObjectFormatProper() {
        return Object.keys(this).every(key => SimpleTimer.INSTANCE_FIELDS.includes(key));
    }

    __pauseStartTimeOrNull = null;
    __lengthInMilliseconds;
    __endTime;
    __name;

    get isPaused() {
        return this.__pauseStartTimeOrNull != null;
    }

    set isPaused(newState) {
        newState = !!newState;
        if (newState == this.isPaused) { return; }
        this.__pauseStartTimeOrNull = newState
            ? now()
            : (this.extend(this.elapsedPauseTime), null);
    }

    get elapsedPauseTime() {
        return this.__elapsedPauseTimeHelper(now());
    }

    __elapsedPauseTimeHelper(timestamp) {
        return this.isPaused
            ? timestamp - this.__pauseStartTimeOrNull
            : 0;
    }

    get length() {
        return this.__lengthInMilliseconds;
    }

    get timeRemainingInMilliseconds() {
        return this.__timeRemainingInMillisecondsHelper(now());
    }

    __timeRemainingInMillisecondsHelper(timestamp) {
        return this.__endTime + this.__elapsedPauseTimeHelper(timestamp) - timestamp;
    }

    get timeRemainingInMillisecondsNonNegative() {
        return Math.max(this.timeRemainingInMilliseconds, 0);
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
            this.__endTime = now();
        }
    }

    get name() {
        return this.__name;
    }

    set name(newName) {
        this.__name = (newName && String(newName)) || this.__defaultName;
    }

    get __defaultName() {
        return this.length + "ms timer";
    }

    constructor(interval) {
        if (typeof interval === "string") {
            Object.assign(this, JSON.parse(interval));
            if (!this.isObjectFormatProper) {
                throw new TypeError("invalid JSON format");
            }
            return this;
        }

        this.__lengthInMilliseconds = toMilliseconds(interval);

        if (this.length <= 0) {
            throw new Error("interval must be positive.");
        }

        this.name = isIntervalObject(interval) && interval.name;

        console.log("Creating a timer running for " + this.length + "ms.");
        console.log("Name: " + this.name);

        this.reset();
    }

    reset() {
        this.isExpired = true;
        this.extend(this.length);
    }

    extend(interval) {
        if (interval) { this.__endTime += toMilliseconds(interval) };
    }

    static fromString(s) {
        return new SimpleTimer( toIntervalObject(intervalStringToArray(s)) );
    }

    toString() {
        return intervalToString(this.timeRemainingInMillisecondsNonNegative);
    }

    static fromJson(jsonString) {
        return new SimpleTimer(jsonString);
    }

    toJson() {
        return JSON.stringify(this);
    }
}

export default SimpleTimer;