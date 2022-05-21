<template>
    <div>
        <top-bar></top-bar>
        <NuxtPage />
        <simple-button
            v-if="$route.name !== 'impressum'"
            @clicked="$router.push('/impressum')"
            class="rounded-b-none border-b-0 fixed right-2 bottom-0"
            >Impressum</simple-button
        >
    </div>
</template>

<script setup lang="ts">
import { validate } from "./utility";

useAuthed().value = await validate();
</script>
