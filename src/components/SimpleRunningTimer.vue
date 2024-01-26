<script setup>
import { ref, watch, onMounted, onUnmounted, } from "vue";
import { intervalToString } from "../modules/intervalObjects";
import SimpleTimer from "../modules/SimpleTimer";
import SetIntervalWrapper from "../modules/SetIntervalWrapper";

///////////////////////////////////
// props and emits ////////////////
///////////////////////////////////

const emit = defineEmits(["onClickPauseTimer", "onClickDeleteTimer"]);

const props = defineProps({
    timer: { type: SimpleTimer, required: true, },
});

const { timer } = props;

function deleteTimer() {
    emit("onClickDeleteTimer", timer);
}

///////////////////////////////////
// reactive state and lifecycle ///
///////////////////////////////////

const reactiveTimeRemaining = ref("Loading...");

watch(reactiveTimeRemaining, () => {
    if (timer.isExpired) {
        internalTimer.shutdown();
        timerExpiredSound.play();
    }
});

onMounted   (() => internalTimer.run());
onUnmounted (() => internalTimer.shutdown());

///////////////////////////////////
// internal timer state ///////////
///////////////////////////////////

const TICK_INTERVAL_IN_MILLISECONDS = 10;

let internalTimer = new SetIntervalWrapper({
    handler:  () => reactiveTimeRemaining.value = timer.timeRemainingInMillisecondsNonNegative,
    interval: TICK_INTERVAL_IN_MILLISECONDS,
});

///////////////////////////////////
// internal play sound state //////
///////////////////////////////////

let timerExpiredSound = new (class TimerExpiredSound {
    #played;
    constructor() {
        this.#played = false;
    }
    play() {
        if (this.#played) { return; }
        this.#playHelper();
        this.#played = true;
    }
    #playHelper() {
        console.log("A sound would be played here, but here's a console message instead.");
    }
})();
</script>

<template>
    <div>
        {{ typeof reactiveTimeRemaining === "string"
            ? reactiveTimeRemaining
            : intervalToString(reactiveTimeRemaining).slice(0, -1) }}
        
        <button @click="deleteTimer">Delete Timer</button>
    </div>
</template>

<style>
</style>