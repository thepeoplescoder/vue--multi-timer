<script setup>
import { ref, watch, onMounted, onUnmounted, } from "vue";
import { SimpleTimer } from "../modules/time";

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

const props = defineProps({
    timer: { type: SimpleTimer, required: true, },
});

const { timer } = props;

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

const valueToDisplay = ref(0);

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

let internalTimerId         = null;
let timerExpiredSoundPlayed = false;

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

watch(valueToDisplay, shutdownTimerAndPlaySoundIfExpired);
onMounted(initializeInternalTimer);
onUnmounted(shutdownInternalTimer);

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

function updateDisplayedValue() {
    valueToDisplay.value = timer.toString();
}

function initializeInternalTimer() {
    if (!internalTimerId) {
        updateDisplayedValue();
        internalTimerId = setInterval(updateDisplayedValue, 10);
    }
}

function shutdownTimerAndPlaySoundIfExpired(timeRemaining) {
    if (timer.isExpired()) {
        shutdownInternalTimer();
        playTimerExpiredSound();
    }
}

function playTimerExpiredSound() {
    if (timerExpiredSoundPlayed) { return; }
    console.log("A sound would be played here.  For now, here's a message on the console.");
    timerExpiredSoundPlayed = true;
}

function shutdownInternalTimer() {
    if (internalTimerId) {
        clearInterval(internalTimerId);
    }
    internalTimerId = null;
}
</script>

<template>
    <div>{{ valueToDisplay }}</div>
</template>

<style>
</style>