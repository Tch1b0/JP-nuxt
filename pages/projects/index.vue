<template>
    <header>
        <top-bar></top-bar>
    </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TopBar from "~~/components/TopBar.vue";

export default defineComponent({
    components: { TopBar },
});
</script>
