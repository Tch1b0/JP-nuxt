<template>
    <div>
        <h1
            class="text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-teal-400 to-teal-900 text-4xl m-5 pb-4">
            Admin Login
        </h1>
        <div class="grid place-items-center text-2xl mt-5">
            <div class="grid gap-7 bg-gray-800 p-5 rounded-md">
                <input
                    class="bg-gray-800 border-2 border-gray-700 rounded-sm p-1 placeholder:text-center"
                    type="text"
                    v-model="username"
                    @keyup.enter="login"
                    placeholder="Username" />
                <input
                    class="bg-gray-800 border-2 border-gray-700 rounded-sm p-1 placeholder:text-center"
                    type="password"
                    v-model="password"
                    @keyup.enter="login"
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
