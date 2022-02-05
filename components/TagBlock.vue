<template>
    <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-gray-50 transition"
        :class="{ 'hover:cursor-pointer': clickable }"
        ><slot></slot
    ></span>
</template>

<script setup lang="ts">
defineProps({
    clickable: {
        type: Boolean,
        default: false,
    },
});
</script>
