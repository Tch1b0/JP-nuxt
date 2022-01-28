<template>
    <div>
        <header class="mb-5">
            <top-bar></top-bar>
        </header>
        <div class="flex justify-center items-center mb-5">
            <div
                class="grid grid-cols-1 w-11/12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:w-max gap-5">
                <project-card v-for="repo in repos" :repo="repo"></project-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
useMeta({
    title: "Johannes Pour - Projects",
});

const resp = useAsyncData("repositories", () => $fetch("/api/repos"));

const repos = resp.data.value;
</script>
