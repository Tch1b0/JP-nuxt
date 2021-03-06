import { defineNuxtConfig } from "nuxt";

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
    meta: {
        link: [
            {
                rel: "alternate",
                type: "application/rss+xml",
                title: "johannespour.de",
                href: "/feed",
            },
        ],
    },
    build: {
        postcss: {
            postcssOptions: require("./postcss.config.js"),
        },
        transpile: ["chart.js"],
    },
    ssr: true,
});
