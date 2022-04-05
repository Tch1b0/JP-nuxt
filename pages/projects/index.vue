<template>
    <div class="flex gap-6 flex-col justify-center items-center mb-5 mt-5">
        <div>
            <tag-block
                v-for="topic of filterTopics"
                :topic="topic"
                :key="topic"></tag-block>
        </div>
        <div
            class="grid grid-cols-1 w-11/12 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 sm:w-max gap-5">
            <transition-group>
                <project-card
                    v-for="project in projects"
                    :project="project"
                    :key="project.id"></project-card>
            </transition-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getProjectMetas, Project, projectSort } from "~~/utility";

useMeta({
    title: "Johannes Pour - Projects",
});

const allProjects = await getProjectMetas();

const filterTopics = useTopicFilter();
watch(filterTopics.value, filterRepos);

// The repositories that are actually shown to the user
let projects = ref<Project[]>([...allProjects]);

function filterRepos() {
    if (filterTopics.value.length === 0) {
        projects.value = allProjects;
    } else {
        projects.value = allProjects.filter((repo) => {
            for (const topic of filterTopics.value) {
                if (!repo.topics.includes(topic)) return false;
            }
            return true;
        });
    }
    projects.value.sort((a, b) => projectSort(a, b)).reverse();
}

// run initially
filterRepos();

// To add a topic-filter just do filterTopics.value.push(...)
// To remove a topc-filter do filterTopics.value.remove(...)
</script>

<style scoped>
.v-move, /* apply transition to moving elements */
.v-enter-active,
.v-leave-active {
    transition: all 0.25s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
