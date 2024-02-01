<script setup>
import { ref, watch, onMounted, onUnmounted, } from "vue";
import { intervalToString } from "../modules/intervalObjects";
import LazyAudioPlayer from "../modules/LazyAudioPlayer";
import SimpleTimer from "../modules/SimpleTimer";
import NeverEndingRequestAnimationFrameWrapper from "../modules/NeverEndingRequestAnimationFrameWrapper";

///////////////////////////////////
// props //////////////////////////
///////////////////////////////////

const props = defineProps({
    timer: { type: SimpleTimer, required: true, },
});

const { timer } = props;

///////////////////////////////////
// emits //////////////////////////
///////////////////////////////////

const emit = defineEmits(["onClickPauseTimer", "onClickDeleteTimer"]);

function onClickDeleteTimer() {
    timerExpiredSound.stop();
    emit("onClickDeleteTimer", timer);
}

function onClickPauseTimer() {
    emit("onClickPauseTimer", timer);
}

///////////////////////////////////
// reactive state /////////////////
///////////////////////////////////

const reactiveTimeRemaining = ref("Loading...");

watch(reactiveTimeRemaining, () => {
    if (timer.isExpired) {
        timerExpiredSound.play();
    }
});

///////////////////////////////////
// lifecycle //////////////////////
///////////////////////////////////

onMounted   (() => internalTimer.run());
onUnmounted (() => {
    internalTimer.shutdown()
    timerExpiredSound.stop();
});

///////////////////////////////////
// internal timer state ///////////
///////////////////////////////////

const internalTimer = new NeverEndingRequestAnimationFrameWrapper({
    callback: () => reactiveTimeRemaining.value = timer.timeRemainingInMilliseconds,
});

///////////////////////////////////
// state of timer expired sound ///
///////////////////////////////////

const AUDIO_FILE_LOCATION = "./src/assets/audio/timer-expired.mp3";

const timerExpiredSound = new LazyAudioPlayer(() => {
    const audio = new Audio(AUDIO_FILE_LOCATION);
    audio.loop = true;
    return audio;
});
</script>

<template>
    <div v-if="(typeof reactiveTimeRemaining === 'string')">
        <div>{{ reactiveTimeRemaining }}</div>
    </div>
    <div v-else-if="reactiveTimeRemaining >= 0">
        <div>{{ intervalToString(reactiveTimeRemaining).slice(0, -1) }}</div>
        <div>
            <button @click="onClickDeleteTimer">X</button>
            <button @click="onClickPauseTimer">{{ timer.isPaused ? ">" : "||" }}</button>
        </div>
    </div>
    <div v-else>
        <div>{{ reactiveTimeRemaining }}</div>
        <div>
            <button @click="onClickDeleteTimer">X</button>
        </div>
    </div>
</template>

<style>
</style>