<script setup>
import SimpleRunningTimer from "./components/SimpleRunningTimer.vue";
import { SimpleTimer } from "./modules/time.js";
</script>

<template>
  <SimpleRunningTimer :timer="new SimpleTimer({weeks: 99})" /><br>
</template>

<style>
</style>
