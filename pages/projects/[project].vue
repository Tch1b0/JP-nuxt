<template>
    <div class="flex flex-col justify-start w-full mt-5 mb-5">
        <div
            class="ml-5 lg:ml-28 text-left w-fit p-3 rounded-lg bg-gray-800 shadow-md">
            <a
                :href="repo.html_url"
                class="flex-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br transition from-teal-400 to-teal-700 hover:text-yellow-500">
                {{ repo.name }}
            </a>
            <p class="text-gray-400 bg-gray-800">{{ repo.description }}</p>
        </div>
        <div class="flex flex-col lg:flex-row items-start">
            <div
                class="flex-2 ml-5 shadow-md lg:ml-28 mt-5 bg-gray-800 w-11/12 lg:w-7/12 rounded-lg">
                <div class="bg-transparent m-5" v-html="markdownArticle"></div>
            </div>
            <div class="flex-1 m-5 gap-3">
                <div
                    class="grid lg:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-3 items-end">
                    <a v-for="image of post.images" :href="image">
                        <img
                            :src="image"
                            alt="preview image"
                            class="w-max col-span-1 hover:opacity-90 transition rounded-lg border-4 border-gray-700 hover:border-blue-700 shadow-md"
                    /></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Repository } from "~~/server/github";
import Post from "~~/server/post";
import { Remarkable } from "remarkable";
import hljs from "highlight.js";
import "assets/styles/dracula-theme.css";

const projectId = useRoute().params.project;

// Process api data
const repo = (
    await useAsyncData<Repository>("repository", () =>
        $fetch(`/api/repo/${projectId}`),
    )
).data.value;
const post = (
    await useAsyncData<Post>("post", () => $fetch(`/api/post/${projectId}`))
).data.value;

// Handle data
const markdownParser = new Remarkable({
    highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(str, {
                language: lang,
            }).value;
        }

        return hljs.highlightAuto(str).value;
    },
    html: true,
});

let markdownArticle = markdownParser.render(post.article);

// Add a horizontal line beneath every </h1>
markdownArticle = markdownArticle.replace(/<\/h1>/g, "</h1>\n<hr>");
</script>

<style>
/*
 * Create markdown styles
 */
h1 {
    @apply text-3xl mt-5 bg-transparent font-semibold;
}
h2 {
    @apply text-2xl mt-4 bg-transparent font-semibold;
}
h3 {
    @apply text-xl mt-2 bg-transparent font-semibold;
}
blockquote {
    @apply italic bg-transparent;
}
a {
    @apply text-blue-400 underline hover:text-blue-200 bg-transparent;
}
p,
ul,
strong,
em,
li {
    @apply text-gray-200 mt-1 bg-transparent;
}
ul {
    @apply ml-5;
    list-style-type: disc;
}
code {
    @apply bg-gray-600 pl-1 pr-1 rounded-sm whitespace-pre-wrap;
}
pre,
pre > code {
    @apply mt-3 mb-3 rounded-sm bg-slate-900;
}
hr {
    @apply border-gray-600 mb-3;
}
</style>
