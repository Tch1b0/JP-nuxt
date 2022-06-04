<template>
    <pie-chart
        :chart-data="data"
        :width="width ?? 400"
        :height="height ?? 400"></pie-chart>
</template>

<script setup lang="ts">
import { PieChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { Project } from "~~/utility";

function generateHexCode() {
    return `#${Math.random().toString(16).slice(2, 8)}`;
}

const props = defineProps<{
    width?: number;
    height?: number;
    projects: Project[];
}>();

Chart.register(...registerables);
Chart.defaults.color = "#fff";

let { projects } = reactive(props);

projects = projects.filter(
    (project) => project?.article?.viewCount !== undefined,
);

const data = {
    labels: projects.map((project) => project.name),
    datasets: [
        {
            data: projects.map((project) => project?.article?.viewCount ?? 0),
            backgroundColor: projects.map(generateHexCode),
        },
    ],
};
</script>
