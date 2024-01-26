<script setup>
import { ref } from "vue";
import SimpleTimer from "../modules/SimpleTimer.js";

const emit = defineEmits(['onTimerCreated']);

const weeks = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

function createTimer() {
    const interval = {
        weeks:   weeks.value,
        days:    days.value,
        hours:   hours.value,
        minutes: minutes.value,
        seconds: seconds.value,
    }

    emit("onTimerCreated", new SimpleTimer(interval));
}
</script>

<template>
    <div>New Timer</div>
    <input type="number" title="weeks" v-model="weeks">
    <input type="number" title="days" v-model="days">
    <input type="number" title="hours" v-model="hours">
    <input type="number" title="minutes" v-model="minutes">
    <input type="number" title="seconds" v-model="seconds">
    <button @click="createTimer">Create Timer!</button>
</template>

<style>
</style>