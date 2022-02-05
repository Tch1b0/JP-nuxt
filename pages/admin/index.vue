<template>
    <div>
        <h3 class="text-center text-gray-500">
            Welcome back, {{ profile.login }}
        </h3>
    </div>
</template>

<script setup lang="ts">
import { Profile } from "~~/server/classes/github";

definePageMeta({
    middleware: ["auth"],
});

const profile = (
    await useAsyncData<Profile>("profile", () => $fetch("/api/profile"))
).data.value;
</script>
