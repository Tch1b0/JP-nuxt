<template>
    <div>
        <div class="grid place-items-center text-2xl">
            <div class="grid gap-7 bg-gray-800 p-5 rounded-md">
                <input
                    class="bg-gray-800 border-2 border-gray-700 rounded-sm"
                    type="text"
                    v-model="username"
                    placeholder="Username" />
                <input
                    class="bg-gray-800 border-2 border-gray-700 rounded-sm"
                    type="text"
                    v-model="password"
                    placeholder="Password" />
                <button
                    @click="login"
                    class="border-2 btn hover:bg-green-600 border-white rounded-md"
                    :class="error ? ['bg-red-600', 'hover:bg-red-600'] : ''">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getAuthCookie } from "~~/utility";

const username = ref("");
const password = ref("");
const error = ref(false);

async function login() {
    if (username.value.length === 0 || password.value.length === 0) return;

    let token: string | undefined;
    await $fetch<{ token: string }>("/api/login", {
        method: "POST",
        body: { username: username.value, password: password.value },
    })
        .then((val) => {
            token = val.token;
        })
        .catch(() => (token = undefined));

    if (token !== undefined) {
        const authCookie = getAuthCookie();
        authCookie.value = `Bearer ${token}`;
        useRouter().push("/admin");
    } else {
        error.value = true;
        setTimeout(() => (error.value = false), 1000);
    }
}
</script>

<style scoped>
.btn {
    transition-duration: 100ms;
}
</style>
