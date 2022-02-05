<template>
    <div class="flex gap-6 flex-col justify-center items-center mb-5 mt-5">
        <div>
            <tag-block
                v-for="topic of filterTopics"
                class="hover:bg-red-500"
                @click="removeFilter(topic)"
                :clickable="true"
                >#{{ topic }}</tag-block
            >
        </div>
        <div
            class="grid grid-cols-1 w-11/12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:w-max gap-5">
            <project-card
                v-for="repo in repos"
                :repo="repo"
                :has-post="postIds.includes(repo.id)"
                :clickable-tags="true"
                @tag-clicked="addFilter"></project-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Repository } from "~~/server/classes/github";
import { getRepos } from "~~/utility";

useMeta({
    title: "Johannes Pour - Projects",
});

const rawRepos = await getRepos();

const postIds = (
    await useAsyncData<number[]>("post-ids", () => $fetch("/api/post-ids"))
).data.value;

const filterTopics = reactive<string[]>([]);
watch(filterTopics, () => filterRepos());

const reposWithPosts = rawRepos.filter((repo) => postIds.includes(repo.id));
const reposWithoutPosts = rawRepos.filter((repo) => !postIds.includes(repo.id));
const allRepos = reposWithPosts.concat(reposWithoutPosts);

// The repositories that are actually shown to the user
let repos = ref<Repository[]>([...allRepos]);

// Sort the repos that have a post in front of those that don't
function filterRepos() {
    if (filterTopics.length > 0) {
        repos.value = allRepos.filter((repo) => {
            for (const topic of filterTopics) {
                if (!repo.topics.includes(topic)) return false;
            }
            return true;
        });
    } else {
        repos.value = allRepos;
    }
}

function addFilter(topic: string) {
    if (!filterTopics.includes(topic)) filterTopics.push(topic);
}

function removeFilter(topic: string) {
    filterTopics.splice(filterTopics.indexOf(topic), 1);
}

// To add a topic-filter just do filterTopics.value.push(...)
// To remove a topc-filter do filterTopics.value.remove(...)
</script>
