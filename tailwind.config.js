module.exports = {
    mode: "jit",
    purge: [
        "./assets/**/*.{css}",
        "./components/*.{vue,js,ts}",
        "./components/**/*.{vue,js,ts}",
        "./pages/*.{vue}",
        "./pages/**/*.{vue}",
        "./plugins/**/*.{js,ts}",
        "./*.{vue,js,ts}",
        "./nuxt.config.{js,ts}",
    ],
    content: [],
    theme: {
        extend: {},
    },
    plugins: [],
};
