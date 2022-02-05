<template>
    <div></div>
</template>

<script setup lang="ts">
import { validate } from "~~/utility";

definePageMeta({
    middleware: ["preauth"],
});

console.log(await validate());
</script>
