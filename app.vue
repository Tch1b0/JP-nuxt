<template>
    <div>
        <top-bar></top-bar>
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
import { validate } from "./utility";

useAuthed().value = await validate();
</script>
