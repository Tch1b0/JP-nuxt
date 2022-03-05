// eslint-disable-next-line no-undef
module.exports = {
    content: [
        "./utility/*.{vue,js,ts}",
        "./assets/**/*.css",
        "./components/*.{vue,js,ts}",
        "./components/**/*.{vue,js,ts}",
        "./pages/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./*.{vue,js,ts}",
        "./nuxt.config.{js,ts}",
    ],
    theme: {
        extend: {
            screens: {
                xxl: "1620px",
            },
        },
    },
    plugins: [],
};
