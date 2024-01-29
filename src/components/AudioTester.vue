<script setup>
import { reactive, computed, onMounted } from "vue";
import { onUnmounted } from "vue";

let sound = reactive({
    audio: null,
    get isPlaying() {
        return !!this.audio;
    },
    play() {
        if (!this.audio) {
            this.audio = new Audio("./src/assets/audio/timer-expired.mp3");
            this.audio.play();
        }
    },
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
    },
});

onMounted(() => {
});
onUnmounted(() => {
    sound.stop();
});
</script>

<template>
    <div v-if="sound.isPlaying">
        <button @click="() => sound.stop()">Stop Audio</button>
    </div>
    <div v-else>
        <button @click="() => sound.play()">Play Audio</button>
    </div>
</template>

<style>
</style>