<template>
    <div class="flex justify-center m-3 rounded-xl gap-5 h-14">
        <a @click="$router.push('/')">
            <img
                class="hover:cursor-pointer hover:opacity-90 transition"
                src="/logo.png"
                width="70px"
                alt="" />
        </a>
        <img
            v-if="authed"
            :src="profile.avatar_url"
            alt="Logo"
            @click="$router.push('/admin')"
            class="rounded-md border-2 border-gray-600 hover:cursor-pointer hover:border-blue-400 transition" />
    </div>
    <hr class="h-1 border-none bg-gradient-to-r from-orange-600 to-blue-600" />
</template>

<script setup lang="ts">
import { Profile } from "~~/server/classes/github";
import { getProfile } from "~~/utility";

const authed = useAuthed();

let profile: Profile;

if (authed.value) {
    profile = await getProfile();
}
</script>
