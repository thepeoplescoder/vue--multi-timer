<script setup>
import { ref, watch, computed, onMounted, onUnmounted, } from "vue";
import { SimpleTimer, intervalToString } from "../modules/time";

///////////////////////////////////
// props //////////////////////////
///////////////////////////////////

const props = defineProps({
    timer: { type: SimpleTimer, required: true, },
});

const { timer } = props;

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

onMounted   (() => internalTimer.initialize());
onUnmounted (() => internalTimer.shutdown());

///////////////////////////////////
// helper functions ///////////////
///////////////////////////////////

function tick() {
    reactiveTimeRemaining.value = timer.toString();
}

///////////////////////////////////
// internal timer state ///////////
///////////////////////////////////

let internalTimer = {
    id: 0,
    initialize() {
        if (!this.id) {
            tick();
            this.id = setInterval(tick, 10);
            console.log("internal timer " + this.id + " initialized");
        }
    },
    shutdown() {
        if (this.id) {
            clearInterval(this.id);
            console.log("internal timer " + this.id + " shutdown");
        }
        this.id = 0;
    },
};

///////////////////////////////////
// internal play sound state //////
///////////////////////////////////

let timerExpiredSound = {
    played: false,
    play() {
        if (this.played) { return; }
        console.log("A sound would be played here, but here's a console message instead.");
        this.played = true;
    },
}
</script>

<template>
    <div>{{ reactiveTimeRemaining.slice(0, -1) }}</div>
</template>

<style>
</style>