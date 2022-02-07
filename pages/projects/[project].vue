<template>
    <div class="flex flex-col justify-start w-full mt-5 mb-5">
        <div class="flex flex-row gap-5 items-center">
            <post-title :repo="repo"></post-title>
            <simple-button
                @clicked="$router.push(`/admin/post/${repo.id}`)"
                class="text-base pr-4 pl-4"
                v-if="authed"
                >Edit</simple-button
            >
        </div>
        <div class="flex flex-col lg:flex-row items-start">
            <div
                class="flex-2 ml-5 shadow-md lg:ml-28 mt-5 bg-gray-800 w-11/12 lg:w-7/12 rounded-lg">
                <post-article :article="post.article"></post-article>
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
import { Repository } from "~~/server/classes/github";
import Post from "~~/server/classes/post";
import "assets/styles/dracula-theme.css";
import { validate } from "~~/utility";

definePageMeta({
    middleware: ["verifyproject", "viewpost"],
});

const projectId = useRoute().params.project;

// Process api data
const repo = (
    await useAsyncData<Repository>("repository", () =>
        $fetch(`/api/repo/${projectId}`),
    )
).data.value;

useMeta({
    title: `Johannes Pour - ${repo.name}`,
    meta: [{ name: "description", content: repo.description }],
});

const post = (
    await useAsyncData<Post>("post", () => $fetch(`/api/post/${projectId}`))
).data.value;

const authed = await validate();
</script>
