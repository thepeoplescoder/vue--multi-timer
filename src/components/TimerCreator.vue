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
    <div>
        <table>
            <thead>
                <tr><th>New Timer</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input type="number" title="weeks" placeholder="weeks"
                            min="0" :max="INTERVAL_KEY_MAX.weeks" v-model="inputs.weeks">
                    </td>
                    <td v-for="key in INTERVAL_OBJECT_KEYS.filter(v => v != 'weeks' && v != 'milliseconds')">
                        :<input type="number" :title="key" :placeholder="key"
                            min="0" :max="INTERVAL_KEY_MAX[key]" v-model="inputs[key]" />
                    </td>
                    <td><button @click="createAndAddTimer">+</button></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td v-for="key in INTERVAL_OBJECT_KEYS.filter(k => k != 'milliseconds')" class="small">{{ key }}</td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style>
tr {
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
}
</style>