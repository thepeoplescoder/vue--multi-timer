<script setup>
import { ref } from "vue";
import SimpleRunningTimer from "./components/SimpleRunningTimer.vue";
import TimerCreator from "./components/TimerCreator.vue";
import roundRobinRange from "./modules/roundRobinRange";

const keyIdGenerator = roundRobinRange();
const timersAndKeys = ref([]);

function addTimer(t) {
  timersAndKeys.value.push({ timer: t, key: keyIdGenerator.next().value });
}
function removeTimer(t) {
  timersAndKeys.value = timersAndKeys.value.filter(v => v.timer != t);
}

</script>

<template>
  <TimerCreator
    @on-timer-created="addTimer"
  />
  <ul>
    <li v-for="obj in timersAndKeys" :key="obj.key">
      <SimpleRunningTimer
        :timer="obj.timer"
        @on-click-delete-timer="removeTimer(obj.timer)"
        @on-click-pause-timer="pauseTimer(obj.timer)"
      />
    </li>
  </ul>
</template>

<style>
</style>
