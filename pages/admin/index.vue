<template>
    <div>
        <h3 class="text-center text-2xl mt-2 text-gray-500">
            Welcome back, {{ profile?.login }}
        </h3>
        <div class="text-center grid gap-2 mt-16">
            <h2 class="text-2xl">Post Views</h2>
            <h4 class="text-base text-gray-500">
                Total views:
                {{ posts.map((post) => post.views).reduce((a, b) => a + b) }}
            </h4>
            <post-chart class="" :posts="posts" :repos="repos"></post-chart>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getPosts, getRepos, getProfile } from "~~/utility/index";

definePageMeta({
    middleware: ["auth"],
});

const profile = await getProfile();
const posts = await getPosts();
const repos = await getRepos();
</script>
