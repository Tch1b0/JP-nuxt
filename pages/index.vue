<template>
    <div>
        <div class="flex flex-col justify-center items-center mt-5">
            <h3 class="text-2xl text-gray-400">Most viewed Projects</h3>
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ml-4 mr-4 gap-3 mb-5">
                <project-card
                    v-for="repo in repos"
                    :repo="repo"
                    class="pt-5"
                    :authed="authed"
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
import { getPostIds, getRepos, validate } from "~~/utility";

useMeta({
    title: "Johannes Pour - German Developer",
    meta: [{ description: "This website is about me & my projects" }],
});

const repos = await getRepos();
// Only take the first 3 repos
repos.splice(3);

const postIds = await getPostIds();

const authed = await validate();
</script>
