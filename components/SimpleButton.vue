<template>
    <button
        class="bg-slate-800 p-2 hover:bg-slate-700 rounded-lg transition shadow-sm"
        @click="$emit('clicked')">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineEmits<{
    (event: "clicked"): void;
}>();
</script>
