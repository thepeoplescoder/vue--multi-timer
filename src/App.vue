<script setup>
import SimpleRunningTimer from "./components/SimpleRunningTimer.vue";
</script>

<template>
  <SimpleRunningTimer :milliseconds="5137" /><br>
  <SimpleRunningTimer :milliseconds="10000" /><br>
  <SimpleRunningTimer :milliseconds="25000" /><br>
  <SimpleRunningTimer :milliseconds="40000" />
</template>

<style>
</style>
