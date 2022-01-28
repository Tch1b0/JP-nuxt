<template>
    <div>
        <header><top-bar></top-bar></header>
        <div class="flex justify-center items-center">
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
