<template>
    <div class="flex flex-col justify-center items-center mt-5">
        <h3 class="text-2xl text-gray-400">Most viewed Projects</h3>
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-max gap-3 mb-5">
            <project-card
                v-for="repo in repos"
                :repo="repo"
                class="pt-5"></project-card>
        </div>
    </div>
    <div class="flex justify-center items-center">
        <button
            class="bg-slate-800 p-2 hover:bg-slate-700 rounded-lg transition shadow-sm"
            @click="$router.push('/projects')">
            All Projects
        </button>
    </div>
</template>

<script setup lang="ts">
useMeta({
    title: "Johannes Pour - German Developer",
    meta: [{ description: "This website is about me & my projects" }],
});

const { data } = await useAsyncData("repositories", () => $fetch("/api/repos"));
const repos = [data.value[30], data.value[29], data.value[28]];
</script>
