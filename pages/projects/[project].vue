<template>
    <div class="flex flex-col justify-start w-full mt-5">
        <div class="ml-5 md:ml-28 text-left">
            <a
                :href="repo.html_url"
                class="flex-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br transition from-teal-400 to-teal-700 hover:text-yellow-500">
                {{ repo.name }}
            </a>
            <p class="text-gray-400">{{ repo.description }}</p>
        </div>
        <div class="ml-8 md:ml-36 mt-10" v-html="markdownArticle"></div>
    </div>
</template>

<script setup lang="ts">
import { Repository } from "~~/server/github";
import Post from "~~/server/post";
import { Remarkable } from "remarkable";

const projectId = useRoute().params.project;

const repo = (
    await useAsyncData<Repository>("repository", () =>
        $fetch(`/api/repo/${projectId}`),
    )
).data.value;

const post = (
    await useAsyncData<Post>("post", () => $fetch(`/api/post/${projectId}`))
).data.value;

const markdownArticle = new Remarkable().render(`# Hello World!
This is a [link](https://youtube.com)

## Following is going to be a list
- Never gonna give you up
- Never gonna let you down

### Something`);
console.log(markdownArticle);
</script>

<style>
/*
 * Create markdown styles
 */

h1 {
    @apply text-3xl;
}
h2 {
    @apply text-2xl mt-2;
}
h3 {
    @apply text-xl mt-1;
}
blockquote {
    @apply italic;
}
a {
    @apply text-blue-400 underline hover:text-blue-200;
}
</style>
