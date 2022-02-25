import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    css: ["@/assets/styles/styles.css"],
    serverMiddleware: [
        {
            path: "/api/",
            handler: "~/server/api.ts",
        },
        {
            path: "/feed",
            handler: "~/server/rss.ts",
        },
    ],
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
    },
    ssr: true,
});
