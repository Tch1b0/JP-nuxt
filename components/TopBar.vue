<template>
    <div class="flex justify-center m-3 rounded-xl">
        <a @click="$router.push('/')">
            <img
                class="hover:cursor-pointer hover:opacity-90 transition"
                src="~~/public/logo.png"
                width="70px"
                alt="" />
        </a>
    </div>
    <hr class="h-1 border-none bg-gradient-to-r from-orange-600 to-blue-600" />
</template>
