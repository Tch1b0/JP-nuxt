<template>
    <div class="m-5 text-center">
        <tag-block
            v-for="topic of topics"
            class="text-gray-400"
            :class="topic.style"
            :topic="topic.text"></tag-block>
    </div>
</template>

<script setup lang="ts">
import { Repository } from "~~/server/classes/github";
import { colorFromLang } from "~~/utility";

useMeta({
    title: "Johannes Pour - Topics",
});

const repos = (
    await useAsyncData<Repository[]>("repositories", () => $fetch("/api/repos"))
).data.value;

const rawTopics = [];
const topics: Array<{ text: string; style: string[] }> = [];

for (const repo of repos) {
    for (const topic of repo.topics) {
        if (rawTopics.includes(topic)) continue;
        rawTopics.push(topic);
        const color =
            colorFromLang((repo.language ?? "python").toLowerCase()) ||
            "python";
        topics.push({
            text: topic,
            style: [`bg-${color}-500`],
        });
    }
}

topics.sort((a, b) => a.text.charCodeAt(0) - b.text.charCodeAt(0));
</script>
