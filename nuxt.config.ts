// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    css: ["@/assets/styles/styles.css"],
    serverHandlers: [
        {
            handler: "~/server/api.ts",
            route: "/api/",
        },
        {
            handler: "~/server/rss.ts",
            route: "/feed",
        },
    ],
    app: {
        head: {
            meta: [
                {
                    property: "link",
                    "data-rel": "alternate",
                    "data-type": "application/rss+xml",
                    "data-title": "johannespour.de",
                    "data-href": "/feed",
                },
            ],
        },
    },
    postcss: {
        config: require("./postcss.config.js"),
    },
    build: {
        transpile: ["chart.js"],
    },
    ssr: true,
});
