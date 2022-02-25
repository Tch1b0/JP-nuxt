<template>
    <span
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-gray-50 transition"
        :class="[
            clickable ? 'hover:cursor-pointer' : '',
            topicFilter.includes(topic)
                ? 'hover:bg-red-500'
                : 'hover:bg-green-500',
        ]"
        @click="clicked"
        >#{{ topic }}</span
    >
</template>

<script setup lang="ts">
import { addOrRemoveTopic } from "~~/composables/topicfilter";

const props = defineProps({
    clickable: {
        type: Boolean,
        default: true,
    },
    topic: {
        type: String,
        required: true,
    },
});

const topicFilter = useTopicFilter();

async function clicked() {
    if (!props.clickable) return;

    addOrRemoveTopic(props.topic);
    if (useRoute().path !== "/projects") {
        await useRouter().push("/projects");
    }
}
</script>
