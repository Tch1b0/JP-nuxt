<template>
    <div>
        <top-bar></top-bar>
        <NuxtPage />

        <BuyMeACoffeeWidget></BuyMeACoffeeWidget>
    </div>
</template>

<script setup lang="ts">
import { validate } from "./utility";

useAuthed().value = await validate();
</script>
