<template>
    <div>
        <div>
            <img
                :src="profile.avatar_url"
                alt="avatar"
                class="rounded-full border-4 border-black w-40" />
            <p>
                My name is Johannes Pour (aka Tch1b0) and I am a
                {{ age }}-year-old developer from Germany.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
useMeta({
    title: "Johannes Pour - About",
});

const { data } = await useAsyncData("profile", () => $fetch("/api/profile"));
const profile: any = data.value;
const age = 16;
</script>
