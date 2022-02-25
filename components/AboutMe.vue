<template>
    <div class="bg-gray-800 rounded-md parent-box shadow-md">
        <div
            class="grid grid-cols-3 grid-rows-2 justify-center pl-2 pr-2 pt-2 gap-5">
            <div
                class="col-span-3 md:col-span-2 p-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-md order-1">
                <p>
                    Hi! My name is <b>Johannes Pour</b>(aka. <b>Tch1b0</b>) and
                    I am a {{ age }}-year-old developer from Germany. I mostly
                    use <a href="https://www.python.org/">Python</a>,
                    <a href="https://www.typescriptlang.org/">TypeScript</a>,
                    <a href="https://vuejs.org/">Vue</a> and
                    <a href="https://godotengine.org/">Godot</a>, sometimes
                    <a href="https://go.dev/">Golang</a> and
                    <a href="https://crystal-lang.org/">Crystal</a>, but I am
                    always looking for new technologies to learn.
                </p>
            </div>
            <div
                class="flex justify-end md:justify-center col-span-2 md:col-span-1 order-3 md:order-2">
                <img
                    :src="profile?.avatar_url"
                    alt="Avatar"
                    class="rounded-md border-2 border-gray-700 w-[120px] h-[120px] md:w-[130px] md:h-[130px]" />
            </div>
            <div class="order-2 md:order-3">
                <ul>
                    <li><a href="https://github.com/Tch1b0">GitHub</a></li>
                    <li><a href="https://tch1b0.itch.io/">itch.io</a></li>
                    <li><a href="https://www.npmjs.com/~tch1b0">npm</a></li>
                    <li><a href="https://pypi.org/user/Tch1b0">pypi</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getProfile, calculateAge } from "~~/utility";

const birthdate = "04/18/2005";
const age = calculateAge(new Date(birthdate));

const profile = await getProfile();
</script>

<style scoped>
ul {
    @apply ml-5 list-disc;
}
a {
    @apply text-blue-300 underline underline-offset-2 hover:text-blue-500 transition;
}
p > a {
    @apply no-underline hover:underline;
}
</style>
