<template>
    <div>
        <header><top-bar></top-bar></header>
        <div class="grid grid-cols-3 w-max gap-4">
            <project-card
                v-for="repo in repos"
                :repo="repo"
                class="pt-5"></project-card>
        </div>
    </div>
</template>

<script setup lang="ts">
useMeta({
    title: "Johannes Pour - German Developer",
});

const { data } = await useAsyncData("repository", () => $fetch("/api/repos"));
const repos = [data.value[30], data.value[29], data.value[28]];
</script>
