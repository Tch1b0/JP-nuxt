<template>
    <div class="flex flex-col gap-5 mt-5 mb-5">
        <post-title :repo="repo" class="ml-5 lg:ml-5"></post-title>
        <div
            class="flex flex-col flex-1 md:flex-row items-start ml-5 mr-5 gap-5 justify-center">
            <div class="grid p-5 gap-5 bg-gray-800 flex-1 rounded-md">
                <textarea
                    v-model="article"
                    cols="30"
                    class="flex-1"
                    rows="10"
                    tabindex="1"></textarea>
                <div class="flex flex-row bg-gray-800 gap-3">
                    <input
                        type="url"
                        v-model="newImage"
                        class="w-full rounded-md ml-3" />
                    <simple-button
                        class="min-h-fit"
                        @clicked="images.push(newImage)"
                        >+</simple-button
                    >
                </div>
                <ul>
                    <transition-group>
                        <li v-for="imageUrl in images" class="list-none">
                            <simple-button
                                @clicked="
                                    images.splice(images.indexOf(imageUrl), 1)
                                "
                                class="pt-0 pb-0 bg-red-700 hover:bg-red-500 mr-2">
                                x
                            </simple-button>
                            <a :href="imageUrl">
                                {{
                                    imageUrl.length > 40
                                        ? imageUrl.slice(0, 40) + "..."
                                        : imageUrl
                                }}</a
                            >
                        </li>
                    </transition-group>
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
            images: images.value,
        },
    })
        .then(() => (failed = false))
        .catch(() => (failed = true));
    if (failed) {
        alert("Something went wrong!");
    } else {
        useRouter().push(`/projects/${projectId}`);
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
            images: images.value,
        },
    })
        .then(() => (failed = false))
        .catch(() => (failed = true));
    if (failed) {
        alert("Something went wrong!");
    } else {
        useRouter().push(`/projects/${projectId}`);
    }
}

async function deletePost() {
    await $fetch("/api/post", {
        method: "DELETE",
        body: { token, "project-id": projectId },
    });
}

const newImage = ref("");
</script>

<style>
.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.v-leave-active {
    position: absolute;
}
</style>
