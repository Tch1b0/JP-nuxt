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
                    class="border-2 btn hover:bg-green-600 border-white rounded-md">
                    Submit
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const username = ref("");
const password = ref("");

async function login() {
    if (username.value.length === 0 || password.value.length === 0) return;

    let token: string | undefined;
    await $fetch<{ token: string }>("/api/login", {
        method: "POST",
        body: { username, password },
    })
        .then((val) => {
            token = val.token;
        })
        .catch(() => (token = undefined));

    if (token !== undefined) {
        const auth = useCookie("Authorization", {
            maxAge: 60 * 60 * 24 * 30,
            secure: true,
        });
        auth.value = `Bearer ${token}`;
    }
    // Todo: Handle wrong credentials
    else {
        console.log("nooo you entered the wrong credentials :(");
    }
}
</script>

<style scoped>
.btn {
    transition-duration: 100ms;
}
</style>
