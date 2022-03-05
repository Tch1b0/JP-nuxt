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
                    v-for="repo in repos"
                    :repo="repo"
                    :key="repo.id"
                    class="pt-5"
                    :has-post="postIds.includes(repo.id)"></project-card>
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
import { getPostIds, getRepos, boolToInt } from "~~/utility";

useMeta({
    title: "Johannes Pour - German Developer",
    meta: [
        {
            name: "description",
            content: "This website is about me & my projects",
        },
    ],
});

const postIds = await getPostIds();
const repos = (await getRepos()).sort(
    (a, b) =>
        boolToInt(postIds.includes(b.id)) - boolToInt(postIds.includes(a.id)),
);
// Only take the first 3 repos
repos.splice(3);

console.log("ci works!");
</script>
