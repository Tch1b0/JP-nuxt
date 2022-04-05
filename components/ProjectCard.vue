<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg h-full">
        <div class="px-6 py-4 background-color">
            <div class="flex font-bold text-xl mb-2 background-color">
                <a
                    class="font-extrabold text-transparent bg-clip-text bg-gradient-to-br transition hover:text-yellow-500"
                    :class="[fromColor, toColor, hasArticle ? 'flex-1' : '']"
                    :href="project.url">
                    {{ project.name }}
                </a>
                <div class="flex-1 text-right background-color">
                    <button
                        v-if="hasArticle"
                        @click="$router.push(`/projects/${project.id}`)"
                        class="border-2 border-green-700 pl-2 pr-2 pb-1 rounded-xl text-green-600 text-sm md:text-lg transition hover:border-green-500 hover:text-green-400">
                        read article
                    </button>
                    <simple-button
                        v-else-if="authed"
                        @clicked="$router.push(`/admin/post/${project.id}`)"
                        class="text-sm">
                        create
                    </simple-button>
                </div>
            </div>
            <p class="text-gray-400 text-base background-color">
                {{ project.description }}
            </p>
        </div>
        <div class="px-6 pt-4 pb-2 background-color h-full sticky">
            <tag-block
                v-for="topic of project.topics"
                :key="topic"
                :topic="topic"></tag-block>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Project } from "~~/utility";

defineEmits<{
    (event: "tagClicked", topic: string): void;
}>();

const props = defineProps<{
    project: Project;
}>();

const authed = useAuthed();
const hasArticle = props.project.article !== undefined;

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
    @apply bg-gray-800;
}
</style>
