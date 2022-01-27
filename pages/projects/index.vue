<template>
    <div>
        <header>
            <top-bar></top-bar>
        </header>
        <div class="grid grid-cols-4 w-max gap-5">
            <project-card v-for="repo in repos" :repo="repo"></project-card>
        </div>
    </div>
</template>

<script setup lang="ts">
const resp = useAsyncData("repositories", () => $fetch("/api/repos"));

const repos = resp.data.value;
</script>
