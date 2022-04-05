<template>
    <div class="absolute h-fit w-full flex justify-center">
        <div
            class="p-9 max-h-56 bg-gray-700 flex flex-col gap-4 items-center rounded-md">
            <img
                :src="
                    success
                        ? '/assets/images/check.png'
                        : '/assets/images/cross.png'
                "
                alt=""
                class="flex-1 w-24" />
            <p class="flex-1"><slot></slot></p>
        </div>
    </div>
</template>

<script setup type="ts">
defineProps({
    success: Boolean
});
</script>
