<template>
    <div class="flex flex-col gap-5 mt-5 mb-5">
        <post-title :repo="repo" class="ml-5 lg:ml-5"></post-title>
        <div
            class="flex flex-col flex-1 md:flex-row items-start ml-5 mr-5 gap-5 justify-center">
            <div class="flex flex-col p-5 gap-5 bg-gray-800 flex-1 rounded-md">
                <textarea
                    v-model="article"
                    cols="30"
                    class="flex-1"
                    rows="10"
                    tabindex="1"></textarea>
                <input type="url" name="" id="" />
                <ul>
                    <li v-for="imageUrl in images">
                        <a :href="imageUrl">
                            {{
                                imageUrl.length > 40
                                    ? imageUrl.slice(0, 40) + "..."
                                    : imageUrl
                            }}</a
                        >
                        <button
                            class="ml-5 bg-red-600 rounded-lg pl-2 pr-2 hidden hover:block">
                            X
                        </button>
                    </li>
                </ul>
                <simple-button
                    class="flex-1"
                    :class="
                        exists
                            ? ['bg-blue-600', 'hover:bg-blue-500']
                            : ['bg-green-600', 'hover:bg-green-500']
                    "
                    @clicked="handlePost"
                    >{{ exists ? "Edit Post" : "Create Post" }}</simple-button
                >
            </div>
            <div class="p-5 bg-gray-800 flex-1 rounded-md">
                <post-article :article="article"></post-article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAuthCookie } from "~~/utility";

definePageMeta({
    middleware: [/* "auth", */ "verifyrepo"],
});

const projectId = Number(useRoute().params.project);

const repo = (
    await useAsyncData("repo", () => $fetch(`/api/repo/${projectId}`))
).data.value;

let exists = (
    await useAsyncData<number[]>("post-ids", () => $fetch("/api/post-ids"))
).data.value.includes(projectId);

const token = getAuthCookie().value.replace("Bearer ", "");
const articleRef = ref("");
const article = reactive(articleRef);
const images = ref<string[]>([]);

if (exists) {
    const response = (
        await useAsyncData<{ article: string; images: string[] }>("post", () =>
            $fetch(`/api/post/${projectId}`),
        )
    ).data.value;

    article.value = response.article;
    images.value = response.images;
}

function handlePost() {
    exists ? editPost() : createPost();
}

async function createPost() {
    let failed: boolean;
    await $fetch("/api/post", {
        method: "POST",
        body: {
            token,
            "project-id": projectId,
            article: article.value,
            images: [],
        },
    })
        .then(() => (failed = false))
        .catch(() => (failed = true));
    if (failed) {
        alert("Something went wrong!");
    } else {
        alert("Post created!");
    }
}

async function editPost() {
    let failed: boolean;
    await $fetch("/api/post", {
        method: "PUT",
        body: {
            token,
            "project-id": projectId,
            article: article.value,
            images: [],
        },
    })
        .then(() => (failed = false))
        .catch(() => (failed = true));
    if (failed) {
        alert("Something went wrong!");
    } else {
        alert("Post edited!");
    }
}

async function deletePost() {
    await $fetch("/api/post", {
        method: "DELETE",
        body: { token, "project-id": projectId },
    });
}
</script>
