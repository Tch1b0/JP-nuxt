<template>
    <div class="flex justify-center items-center mb-5 mt-5">
        <div
            class="grid grid-cols-1 w-11/12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:w-max gap-5">
            <project-card
                v-for="repo in repos"
                :repo="repo"
                :has-post="postIds.includes(repo.id)"></project-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Repository } from "~~/server/github";

useMeta({
    title: "Johannes Pour - Projects",
});

const repos = (
    await useAsyncData<Repository[]>("repositories", () => $fetch("/api/repos"))
).data.value;

const postIds = (
    await useAsyncData<number[]>("post-ids", () => $fetch("/api/post-ids"))
).data.value;
</script>
