/**
 * Encapsulates a basic requestAnimationFrame pattern.
 */
import roundRobinRange from "./roundRobinRange";
const idGenerator = roundRobinRange();
export class NeverEndingRequestAnimationFrameWrapper {
    __callback;
    __id = idGenerator.next().value;
    __isRunning = false;
    __lastHandle = 0;

    constructor({ callback }) {
        this.__callback = callback;
    }
    run() {
        if (this.__isRunning) { return; }
        this.__isRunning = true;
        console.log("animation handler " + this.__id + " running");
        this.__update();
    }
    __update() {
        this.__callback();
        this.__lastHandle = requestAnimationFrame(() => this.__update());
    }
    shutdown() {
        if (!this.__isRunning) { return; }
        if (this.__lastHandle) { cancelAnimationFrame(this.__lastHandle); }
        this.__lastHandle = 0;
        this.__isRunning = false;
        console.log("animation handler " + this.__id + " shutdown");
    }
}

export default NeverEndingRequestAnimationFrameWrapper;