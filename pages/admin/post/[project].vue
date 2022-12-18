<template>
    <div class="flex flex-col gap-5 mt-5 mb-5">
        <action-overlay
            v-if="action?.visible ?? false"
            :success="action?.success ?? false"
            >{{ action?.message ?? "Something went wrong..." }}</action-overlay
        >
        <div class="flex gap-4 items-center">
            <project-title
                :project="project"
                class="ml-5 lg:ml-5"></project-title>
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
                    v-model="content"
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
                    @clicked="handleArticle"
                    >{{
                        exists ? "Edit Article" : "Create Article"
                    }}</simple-button
                >
                <simple-button
                    v-if="exists"
                    class="flex-1 bg-red-600 hover:bg-red-500"
                    @clicked="deleteArticle"
                    >Delete</simple-button
                >
            </div>
            <div class="p-5 bg-gray-800 flex-1 rounded-md">
                <project-article :content="content"></project-article>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAuthCookie, getProject } from "~~/utility";

definePageMeta({
    middleware: ["auth", "verifyproject"],
});

const projectId = Number(useRoute().params.project);
const project = await getProject(projectId);
useHead({
    title: `Johannes Pour - Edit ${project.name}`,
});

// the token to create/edit/delete a post
const token = getAuthCookie().value?.replace(/^Bearer /, "");

// make article object reactive
const content = reactive(ref(""));

const newImage = ref("");
const images = ref<string[]>([]);
const action = ref<{
    success?: boolean;
    message?: string;
    visible?: boolean;
}>({});
let exists = reactive(ref(false));

content.value = project?.article?.content ?? "";
images.value = project?.article?.images ?? [];
exists.value = project?.article !== undefined ?? false;

function handleArticle() {
    exists.value ? editArticle() : createArticle();
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

/**
 * interact with the article object on the api
 * @param options the fetch options
 * @param success callback on success
 * @param fail callback on fail
 * @returns whether the request was successful or not
 */
async function articleAction(
    options: {
        method: string;
        body: object;
    },
    success: () => void,
    fail: () => void,
): Promise<boolean> {
    let failed = false;
    await $fetch("/api/article", options)
        .then(() => (failed = false))
        .catch(() => (failed = true));
    if (failed) fail();
    else success();

    await refreshNuxtData();

    return !failed;
}

const createArticle = async () =>
    await articleAction(
        {
            method: "POST",
            body: {
                token,
                "project-id": projectId,
                content: content.value,
                images: images.value,
            },
        },
        () => {
            displayAction(true, "Article created!");
            exists.value = true;
        },
        () => displayAction(false, "Could not create Article"),
    );

const editArticle = async () =>
    await articleAction(
        {
            method: "PUT",
            body: {
                token,
                "project-id": projectId,
                content: content.value,
                images: images.value,
            },
        },
        () => displayAction(true, "Article edited!"),
        () => displayAction(false, "Could not edit Article"),
    );

const deleteArticle = async () =>
    await articleAction(
        {
            method: "DELETE",
            body: { token, "project-id": projectId },
        },
        async () => await useRouter().push(`/projects`),
        () => displayAction(false, "Could not delete Article"),
    );

function addImage() {
    images.value.push(newImage.value);
    newImage.value = "";
}
</script>

<style scoped>
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
