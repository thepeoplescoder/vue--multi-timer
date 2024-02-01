<script setup>
import { reactive, inject } from "vue";

import SimpleTimer from "../modules/SimpleTimer";
import roundRobinRange from "../modules/roundRobinRange";
import { INTERVAL_OBJECT_KEYS, INTERVAL_KEY_MAX } from "../modules/intervalObjects";

const inputs = reactive({ weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

const keyIdGenerator = roundRobinRange();
const timersAndKeys = inject("timersAndKeys");

function createAndAddTimer() {
    const timer = new SimpleTimer(inputs);
    const key   = keyIdGenerator.next().value;
    timersAndKeys.value.push({ timer, key });
    Object.keys(inputs).forEach(k => inputs[k] = 0);
}
</script>

<template>
    <table class="mx-auto bg-gray-200 rounded-xl shadow-xl">
        <thead>
            <tr><th class="p-2">New Timer</th></tr>
        </thead>
        <tbody>
            <tr class="first:p-2">
                <td class="" v-for="key in INTERVAL_OBJECT_KEYS.filter(v => v != 'seconds' && v != 'milliseconds')">
                    <input type="number" :title="key" :placeholder="key"
                        min="0" :max="INTERVAL_KEY_MAX[key]" v-model="inputs[key]" />:
                </td>
                <td>
                    <input type="number" title="seconds" placeholder="seconds"
                        min="0" :max="INTERVAL_KEY_MAX.seconds" v-model="inputs.seconds">
                </td>
                <td>
                    <button
                        @click="createAndAddTimer"
                        class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full
                                border border-purple-200
                                hover:text-white hover:bg-purple-600 hover:border-transparent
                                focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">+</button>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td v-for="key in INTERVAL_OBJECT_KEYS.filter(k => k != 'milliseconds')">{{ key }}</td>
                <td></td>
            </tr>
        </tfoot>
    </table>
</template>

<style>
/* tr {
    margin: 0;
    padding: 0;
}
td {
    margin: 0px;
    padding: 0px;
}
.small {
    font-size: 7pt;
}
input {
    font-family: Consolas, "Lucida Console", monospace;
    font-size: 12pt;
} */
</style>