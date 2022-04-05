<template>
    <div class="flex flex-col justify-center items-center">
        <h3 class="text-center text-2xl mt-2 text-gray-500">
            Welcome back, {{ profile?.login }}
        </h3>
        <div class="text-center grid gap-2 mt-16 w-[400px]">
            <h2 class="text-2xl">Post Views</h2>
            <h4 class="text-base text-gray-500">
                Total views: {{ totalViews }}
            </h4>
            <post-chart :projects="projects"></post-chart>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getProjectMetas, getProfile } from "~~/utility/index";

useMeta({
    title: "Johannes Pour - Admin",
});

definePageMeta({
    middleware: ["auth"],
});

const profile = await getProfile();
const projects = await getProjectMetas();

const totalViews =
    projects.length != 0
        ? projects
              .map((project) => project?.article.viewCount ?? 0)
              .reduce((a, b) => a + b)
        : 0;
</script>
