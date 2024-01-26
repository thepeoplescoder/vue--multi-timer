/**
 * Encapsulates the setInterval setup/teardown pattern.
 */
export class SetIntervalWrapper {
    __handler;
    __interval;
    __id = 0;
    constructor({ handler, interval }) {
        this.__handler = handler;
        this.__interval = interval;
    }
    run() {
        if (!this.__id) {
            this.__handler();
            this.__id = setInterval(this.__handler, this.__interval);
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