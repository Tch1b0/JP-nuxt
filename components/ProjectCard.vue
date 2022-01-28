<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg h-full">
        <div class="px-6 py-4 background-color">
            <div class="font-bold text-xl mb-2 background-color">
                <a
                    class="font-extrabold text-transparent bg-clip-text bg-gradient-to-br"
                    :class="[fromColor, toColor]"
                    :href="repo.html_url">
                    {{ repo.name }}
                </a>
            </div>
            <p class="text-gray-400 text-base background-color">
                {{ repo.description }}
            </p>
        </div>
        <div class="px-6 pt-4 pb-2 background-color h-full sticky">
            <tag-block v-for="tag of repo.topics" :key="tag"
                >#{{ tag }}</tag-block
            >
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    repo: Object,
});
const gradients = [
    ["from-blue-500", "to-purple-500"],
    ["from-green-400", "to-emerald-500"],
    ["from-red-400", "to-red-600"],
];
const [fromColor, toColor] =
    gradients[Math.floor(Math.random() * gradients.length)];
</script>

<style>
.background-color {
    /* noinspection CssInvalidAtRule */
    @apply bg-gray-800;
}
</style>
