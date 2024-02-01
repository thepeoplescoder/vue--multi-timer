/**
 * Encapsulates the setInterval setup/teardown pattern.
 */
const DEFAULT_INTERVAL_MILLIS = 10;
export class SetIntervalWrapper {
    __callback;
    __interval;
    __id = 0;
    constructor({ callback, interval }) {
        if (interval == undefined) {
            interval = DEFAULT_INTERVAL_MILLIS;
        }

        this.__callback = callback;
        this.__interval = interval;
    }
    run() {
        if (!this.__id) {
            this.__callback();
            this.__id = setInterval(this.__callback, this.__interval);
            console.log("internal timer " + this.__id + " initialized");
        }
    }
    shutdown() {
        if (this.__id) {
            clearInterval(this.__id);
            console.log("internal timer " + this.__id + " shutdown");
        }
        this.__id = 0;
    }
}

export default SetIntervalWrapper;