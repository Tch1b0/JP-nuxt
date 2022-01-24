<template>
    <div>
        <button @click="counter++">+</button>
        <h4>{{ counter }}</h4>
        <button @click="counter--">-</button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        useMeta({
            title: "Johannes Pour - German Developer",
        });
        const counter = ref(0);
        return {
            counter,
        };
    },
});
</script>
