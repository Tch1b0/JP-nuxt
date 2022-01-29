<template>
    <div>
        <h1>Hi!</h1>
    </div>
</template>

<script setup lang="ts">
const projectId = useRoute().params.project;

async function getData(name: string, uri: string) {
    const { data, error } = await useAsyncData(name, () => $fetch(uri));
    if (error !== undefined) {
        navigateTo({ path: "/projects" });
    } else {
        return data.value;
    }
}

const repo = await getData("repository", `/api/repo/${projectId}`);
const post = await getData("post", `/api/post/${projectId}`);
</script>
