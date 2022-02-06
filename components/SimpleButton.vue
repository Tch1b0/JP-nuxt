<template>
    <button
        class="bg-slate-800 p-2 hover:bg-slate-700 rounded-lg transition shadow-sm border-2 border-gray-700"
        @click="$emit('clicked')">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineEmits<{
    (event: "clicked"): void;
}>();
</script>
