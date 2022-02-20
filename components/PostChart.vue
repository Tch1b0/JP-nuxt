<template>
    <pie-chart
        :chart-data="data"
        :width="width ?? 400"
        :height="height ?? 400"></pie-chart>
</template>

<script setup lang="ts">
import { PieChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { getRepos, getPosts, Post } from "~~/utility";
import { Repository } from "~~/server/classes/github";

function generateHexCode() {
    return `#${Math.random().toString(16).slice(2, 8)}`;
}

const props = defineProps<{
    width?: number;
    height?: number;
    posts: Post[];
    repos: Repository[];
}>();

Chart.register(...registerables);
Chart.defaults.color = "#fff";

let posts: Post[];
let repos: Repository[];

if (props.posts === undefined || props.repos === undefined) {
    posts = await getPosts();
    repos = await getRepos();
} else {
    posts = props.posts;
    repos = props.repos;
}

const data = {
    labels: posts.map(
        (post) => repos.find((repo) => post["project-id"] === repo.id).name,
    ),
    datasets: [
        {
            data: posts.map((post) => post.views),
            backgroundColor: posts.map(() => generateHexCode()),
        },
    ],
};
</script>
