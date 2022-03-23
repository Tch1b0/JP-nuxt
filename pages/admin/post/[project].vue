<template>
    <div class="flex flex-col gap-5 mt-5 mb-5">
        <action-overlay
            v-if="action.visible ?? false"
            :success="action.success ?? false"
            >{{ action.message ?? "Something went wrong..." }}</action-overlay
        >
        <div class="flex gap-4 items-center">
            <post-title :repo="repo" class="ml-5 lg:ml-5"></post-title>
            <simple-button
                @clicked="$router.push(`/projects/${projectId}`)"
                v-if="exists"
                >&#10145;</simple-button
            >
        </div>
        <div
            class="flex flex-col flex-1 md:flex-row items-start ml-5 mr-5 gap-5 justify-center">
            <div class="grid p-5 gap-5 bg-gray-800 flex-1 rounded-md">
                <textarea
                    v-model="article"
                    cols="30"
                    class="flex-1 bg-gray-900 pl-1"
                    rows="10"
                    tabindex="1"
                    placeholder="Article Content"></textarea>
                <div class="flex flex-row bg-gray-800 gap-3">
                    <input
                        type="url"
                        v-model="newImage"
                        class="w-full rounded-sm pl-1 bg-gray-900"
                        placeholder="https://example.com/image.jpg" />
                    <simple-button class="min-h-fit" @clicked="addImage"
                        >+</simple-button
                    >
                </div>
                <ul>
                    <transition-group>
                        <li
                            v-for="imageUrl in images"
                            class="list-none"
                            :key="imageUrl">
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
                <simple-button
                    v-if="exists"
                    class="flex-1 bg-red-600 hover:bg-red-500"
                    @clicked="deletePost"
                    >Delete</simple-button
                >
            </div>
            <div class="p-5 bg-gray-800 flex-1 rounded-md">
                <post-article :article="article"></post-article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAuthCookie, getPost, getPostIds, getRepo } from "~~/utility";

definePageMeta({
    middleware: ["auth", "verifyrepo"],
});

const projectId = Number(useRoute().params.project);
const repo = await getRepo(projectId);
useMeta({
    title: `Johannes Pour - Edit ${repo.name}`,
    meta: [
        {
            description: repo.description,
        },
    ],
});

let exists = ref((await getPostIds()).includes(projectId));

// the token to create/edit/delete a post
const token = getAuthCookie().value.replace(/^Bearer /, "");

// make article object reactive
const articleRef = ref("");
const article = reactive(articleRef);

const newImage = ref("");
const images = ref<string[]>([]);
const action = ref<{
    success?: boolean;
    message?: string;
    visible?: boolean;
}>({});

if (exists.value) {
    const response = await getPost(projectId);

    article.value = response.article;
    images.value = response.images;
}

function handlePost() {
    exists.value ? editPost() : createPost();
}

function displayAction(success: boolean, message: string) {
    action.value.success = success;
    action.value.message = message;
    action.value.visible = true;
    const displaySeconds = 4;
    setTimeout(() => {
        action.value.visible = false;
    }, displaySeconds * 1000);
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
        displayAction(false, "Could not create post");
    } else {
        displayAction(true, "Post created!");
        exists.value = true;
        // await useRouter().push(`/projects/${projectId}`);
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
        displayAction(false, "Could not edit post");
    } else {
        displayAction(true, "Post edited!");
        // await useRouter().push(`/projects/${projectId}`);
    }
}

async function deletePost() {
    let failed: boolean;
    await $fetch("/api/post", {
        method: "DELETE",
        body: { token, "project-id": projectId },
    })
        .then(() => (failed = false))
        .catch(() => (failed = true));
    if (failed) {
        displayAction(false, "Could not delete post");
    } else {
        await useRouter().push(`/projects`);
    }
}

function addImage() {
    images.value.push(newImage.value);
    newImage.value = "";
}
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
