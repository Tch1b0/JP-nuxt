<template>
    <div class="h-96 w-1/3 gap-4 grid grid-cols-3 grid-rows-2">
        <div class="flex-1 im-circle"></div>
        <img class="flex-1" src="assets/icons/logo.svg" />
        <div class="flex-1 im-circle"></div>
        <div class="flex-1 circle"></div>
        <div class="flex-1 circle"></div>
        <div class="flex-1 circle"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    setup() {
        useMeta({
            title: "Johannes Pour - German Developer",
        });
    },
});
</script>

<style scoped>
.circle {
    border-radius: 100%;
    background-color: gray;
}
.im-circle {
    @apply circle;
    outline: 1px solid red;
    background-color: rgba(128, 128, 128, 0.493);
}
</style>
