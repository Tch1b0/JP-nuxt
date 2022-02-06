<template>
    <div class="bg-transparent m-5" v-html="markdownArticle"></div>
</template>

<script setup lang="ts">
import { Remarkable } from "remarkable";
import hljs from "highlight.js";

const props = defineProps({
    article: {
        type: String,
        required: true,
    },
});
watch(props, () => render());

const markdownArticle = reactive(ref(""));

function render() {
    // Handle data
    const markdownParser = new Remarkable({
        highlight(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(str, {
                    language: lang,
                }).value;
            }

            return hljs.highlightAuto(str).value;
        },
        html: true,
    });

    markdownArticle.value = markdownParser.render(props.article);

    // Add a horizontal line beneath every </h1>
    markdownArticle.value = markdownArticle.value.replace(
        /<\/h1>/g,
        "</h1>\n<hr>",
    );
}

render();
</script>

<style>
/*
 * Create markdown styles
 */
h1 {
    @apply text-3xl mt-5 bg-transparent font-semibold;
}
h2 {
    @apply text-2xl mt-4 bg-transparent font-semibold;
}
h3 {
    @apply text-xl mt-2 bg-transparent font-semibold;
}
blockquote {
    @apply italic bg-transparent;
}
a {
    @apply text-blue-400 underline hover:text-blue-200 bg-transparent;
}
p,
ul,
strong,
em,
li {
    @apply text-gray-200 mt-1 bg-transparent;
}
ul {
    @apply ml-5;
    list-style-type: disc;
}
code {
    @apply bg-gray-600 pl-1 pr-1 rounded-sm whitespace-pre-wrap;
}
pre,
pre > code {
    @apply mt-3 mb-3 rounded-sm bg-slate-900;
}
hr {
    @apply border-gray-600 mb-3;
}
</style>
