<!--
    SimpleRunningTimer.vue
    A timer that runs immediately upon existing.
-->

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, } from "vue";

const props = defineProps({
    milliseconds: { type: Number, required: true, },
});

let internalTimerId = null;

const startTimestamp = (new Date()).getTime();
const endTimestamp   = startTimestamp + props.milliseconds;
const timeRemaining  = ref(0);

const computedTimeRemainingInHundrethsOfSeconds = computed(() => Math.floor(timeRemaining.value / 10));

watch(timeRemaining, shutdownTimerIfExpired);
onMounted(initializeInternalTimer);
onUnmounted(shutdownInternalTimer);

function initializeInternalTimer() {
    if (!internalTimerId) {
        tick();
        internalTimerId = setInterval(tick, 10);
    }
}

function shutdownTimerIfExpired(timeRemaining) {
    if (timeRemaining <= 0) {
        shutdownInternalTimer();
    }
}

function shutdownInternalTimer() {
    if (internalTimerId) {
        clearInterval(internalTimerId);
    }
    internalTimerId = null;
}

function tick() {
    timeRemaining.value = timeRemainingInMilliseconds();
}

function timeRemainingInMilliseconds() {
    return Math.max(endTimestamp - (new Date()).getTime(), 0);
}
</script>

<template>
    {{ computedTimeRemainingInHundrethsOfSeconds }}
</template>

<style>
</style>