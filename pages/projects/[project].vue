<template>
    <div>
        <h1>{{ repo.name }}</h1>
        <p>{{ repo.description }}</p>
        <br />
        <p>{{ post.article }}</p>
    </div>
</template>

<script setup lang="ts">
import { Repository } from "~~/server/github";
import Post from "~~/server/post";

const projectId = useRoute().params.project;

const repo: any = (
    await useAsyncData<Repository>("repository", () =>
        $fetch(`/api/repo/${projectId}`),
    )
).data.value;

const post = (
    await useAsyncData<Post>("post", () => $fetch(`/api/post/${projectId}`))
).data.value;
</script>
