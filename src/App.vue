<script setup>
import { ref, provide } from "vue";
import TimerCreator from "./components/TimerCreator.vue";
import TimerList from "./components/TimerList.vue";

const timersAndKeys = ref([]);

provide("timersAndKeys", timersAndKeys);
</script>

<template>
  <TimerCreator />
  <TimerList />
</template>

<style>
</style>
