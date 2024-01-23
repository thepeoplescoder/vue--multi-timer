<script setup>
import SimpleRunningTimer from "./components/SimpleRunningTimer.vue";
import { SimpleTimer } from "./modules/time.js";
</script>

<template>
  <SimpleRunningTimer :timer="new SimpleTimer({seconds: 10})" /><br>
</template>

<style>
</style>
