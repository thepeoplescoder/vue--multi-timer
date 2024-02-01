import throwNew from "./throwNew.js";
export class LazyAudioPlayer {
    __audio = null;
    __supplier;
    constructor(audioSupplier) {
        this.__supplier = typeof audioSupplier === "function"
            ? audioSupplier
            : throwNew(TypeError, "audioSupplier must be a function that returns an Audio object.");
    }
    get isPlaying() {
        return !!this.__audio && !this.__audio.paused;
    }
    play() {
        if (this.isPlaying) { return; }
        this.__audio = this.__supplier();
        this.__audio.play();
    }
    stop() {
        if (!this.isPlaying) { return; }
        this.__audio.pause();
        this.__audio.currentTime = 0;
        this.__audio = null;
    }
}

export default LazyAudioPlayer;