<!--
    SimpleRunningTimer.vue
    A timer that runs immediately upon existing.
-->

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, } from "vue";

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

const props = defineProps({
    milliseconds: { type: Number, required: true, },
});

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

let internalTimerId = null;
let timerExpiredSoundPlayed = false;

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

const startTimestamp = (new Date()).getTime();
const endTimestamp   = startTimestamp + props.milliseconds;
const timeRemaining  = ref(0);

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

const VALUE_TO_DISPLAY = computed(reactiveTimeRemainingInHundredthsOfSeconds);

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

watch(timeRemaining, shutdownTimerAndPlaySoundIfExpired);
onMounted(initializeInternalTimer);
onUnmounted(shutdownInternalTimer);

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

function tick() {
    timeRemaining.value = timeRemainingInMilliseconds();
}

function initializeInternalTimer() {
    if (!internalTimerId) {
        tick();
        internalTimerId = setInterval(tick, 10);
    }
}

function shutdownTimerAndPlaySoundIfExpired(timeRemaining) {
    if (timeRemaining <= 0) {
        shutdownInternalTimer();
        playTimerExpiredSound();
    }
}

function playTimerExpiredSound() {
    if (timerExpiredSoundPlayed) { return; }
    alert("A sound would be played here.  For now, here's an alert box.");
    timerExpiredSoundPlayed = true;
}

function shutdownInternalTimer() {
    if (internalTimerId) {
        clearInterval(internalTimerId);
    }
    internalTimerId = null;
}

function reactiveTimeRemainingInHundredthsOfSeconds() {
    return Math.floor(timeRemaining.value / 10);
}

function timeRemainingInMilliseconds() {
    return Math.max(endTimestamp - (new Date()).getTime(), 0);
}
</script>

<template>
    <div>{{ VALUE_TO_DISPLAY }}</div>
</template>

<style>
</style>