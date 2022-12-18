<template>
    <div class="m-5 text-center">
        <tag-block
            v-for="topic of topics"
            class="text-gray-400"
            :class="topic.style"
            :topic="topic.text"
            :key="topic.text"></tag-block>
    </div>
</template>

<script setup lang="ts">
import { colorFromLang, getProjectMetas } from "~~/utility";

useHead({
    title: "Johannes Pour - Topics",
});

const projects = await getProjectMetas();

const rawTopics = [] as string[];
const topics: Array<{ text: string; style: string[] }> = [];

for (const project of projects) {
    for (const topic of project.topics) {
        if (rawTopics.includes(topic)) continue;
        rawTopics.push(topic);
        const color =
            colorFromLang((project.language ?? "python").toLowerCase()) ??
            "white";
        topics.push({
            text: topic,
            style: [`bg-${color}-500`],
        });
    }
}

topics.sort((a, b) => a.text.charCodeAt(0) - b.text.charCodeAt(0));
</script>
