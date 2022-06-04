<template>
    <div class="absolute h-fit w-full flex justify-center">
        <div
            class="p-9 max-h-56 bg-gray-700 flex flex-col gap-4 items-center rounded-md">
            <img
                :src="success ? checkImage : crossImage"
                alt=""
                class="flex-1 w-24" />
            <p class="flex-1"><slot></slot></p>
        </div>
    </div>
</template>

<script setup type="ts">
import checkImage from "assets/images/check.png";
import crossImage from "assets/images/cross.png";

defineProps({
    success: Boolean
});
</script>
