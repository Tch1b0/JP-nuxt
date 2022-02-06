<template>
    <div
        class="ml-5 lg:ml-28 text-left w-fit p-3 rounded-lg bg-gray-800 shadow-md">
        <a
            :href="repo.html_url"
            class="flex-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br transition from-teal-400 to-teal-700 hover:text-yellow-500">
            {{ repo.name }}
        </a>
        <p class="text-gray-400 bg-gray-800">{{ repo.description }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps({
    repo: {
        type: Object,
        required: true,
    },
});
</script>
