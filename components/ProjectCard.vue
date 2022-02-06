<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg h-full">
        <div class="px-6 py-4 background-color">
            <div class="flex font-bold text-xl mb-2 background-color">
                <a
                    class="font-extrabold text-transparent bg-clip-text bg-gradient-to-br transition hover:text-yellow-500"
                    :class="[fromColor, toColor, hasPost ? 'flex-1' : '']"
                    :href="repo.html_url">
                    {{ repo.name }}
                </a>
                <div class="flex-1 text-right background-color">
                    <button
                        v-if="hasPost"
                        @click="$router.push(`/projects/${repo.id}`)"
                        class="border-2 border-green-700 pl-2 pr-2 pb-1 rounded-xl text-green-600 text-sm md:text-lg transition hover:border-green-500 hover:text-green-400">
                        read article
                    </button>
                    <simple-button
                        v-else-if="authed"
                        @clicked="$router.push(`/admin/post/${repo.id}`)"
                        class="text-sm">
                        Create
                    </simple-button>
                </div>
            </div>
            <p class="text-gray-400 text-base background-color">
                {{ repo.description }}
            </p>
        </div>
        <div class="px-6 pt-4 pb-2 background-color h-full sticky">
            <tag-block
                v-for="topic of repo.topics"
                :key="topic"
                :topic="topic"></tag-block>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    (event: "tagClicked", topic: string): void;
}>();

defineProps({
    repo: Object,
    hasPost: {
        type: Boolean,
        default: false,
    },
    authed: {
        type: Boolean,
        default: false,
    },
});
const gradients = [
    ["from-blue-500", "to-purple-500"],
    ["from-green-400", "to-emerald-500"],
    ["from-red-400", "to-red-600"],
];
const [fromColor, toColor] =
    gradients[Math.floor(Math.random() * gradients.length)];
</script>

<style scoped>
.background-color {
    /* noinspection CssInvalidAtRule */
    @apply bg-gray-800;
}
</style>
