<script setup>
import { inject } from "vue";
import SimpleRunningTimer from "./SimpleRunningTimer.vue";

const timersAndKeys = inject("timersAndKeys");

function deleteTimer(timer) {
    timersAndKeys.value = timersAndKeys.value.filter(v => v.timer != timer);
}

function togglePause(timer) {
    timer.isPaused = !timer.isPaused;
}
</script>

<template>
    <div>
        <ul>
            <li v-for="obj in timersAndKeys" :key="obj.key">
                <SimpleRunningTimer :timer="obj.timer" @on-click-delete-timer="deleteTimer"
                    @on-click-pause-timer="togglePause" />
            </li>
        </ul>
    </div>
</template>

<style>
</style>
