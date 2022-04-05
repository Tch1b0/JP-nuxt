<template>
    <div>
        <div class="flex flex-col items-center justify-center mt-5">
            <about-me class="w-[22rem] sm:w-[25rem] md:w-[40rem]"></about-me>
        </div>
        <div class="flex flex-col justify-center items-center mt-5">
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ml-4 mr-4 gap-3 mb-5"
                id="example-projects">
                <project-card
                    v-for="project in projects"
                    :project="project"
                    :key="project.id"
                    class="pt-5"></project-card>
            </div>
        </div>
        <div class="flex justify-center items-center mb-5">
            <div class="grid grid-cols-2 gap-4">
                <simple-button @clicked="$router.push('/projects')">
                    All Projects
                </simple-button>
                <simple-button @clicked="$router.push('/projects/topics')"
                    >All Topics</simple-button
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getProjectMetas, projectSort } from "~~/utility";

useMeta({
    title: "Johannes Pour - German Developer",
    meta: [
        {
            name: "description",
            content: "This website is about me & my projects",
        },
    ],
});
const projects = (await getProjectMetas())
    .sort((a, b) => projectSort(a, b))
    .reverse();

// Only take the first 3 projects
projects.splice(3);
</script>
