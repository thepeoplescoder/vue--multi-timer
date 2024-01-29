export class LazyAudioPlayer {
    __audio;
    __supplier;
    constructor(audioSupplier) {
        this.__audio = null;

        if (typeof audioSupplier !== "function") {
            throw new TypeError("audioSupplier must be a function that returns an Audio object.");
        }

        this.__supplier = audioSupplier;
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