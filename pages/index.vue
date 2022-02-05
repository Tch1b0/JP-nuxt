<template>
    <div>
        <div class="flex flex-col justify-center items-center mt-5">
            <h3 class="text-2xl text-gray-400">Most viewed Projects</h3>
            <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-max gap-3 mb-5">
                <project-card
                    v-for="repo in repos"
                    :repo="repo"
                    class="pt-5"
                    :has-post="postIds.includes(repo.id)"></project-card>
            </div>
        </div>
        <div class="flex justify-center items-center">
            <button
                class="bg-slate-800 p-2 hover:bg-slate-700 rounded-lg transition shadow-sm"
                @click="$router.push('/projects')">
                All Projects
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getRepos } from "~~/utility";

useMeta({
    title: "Johannes Pour - German Developer",
    meta: [{ description: "This website is about me & my projects" }],
});

const repos = await getRepos();
// Only take the first 3 repos
repos.splice(3);

const postIds = (
    await useAsyncData<number[]>("post-ids", () => $fetch("/api/post-ids"))
).data.value;
</script>
