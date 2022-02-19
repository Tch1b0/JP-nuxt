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

function urify(str: string): string {
    let newStr = "";
    for (const s of str) {
        if (/ /.test(s)) {
            newStr += "-";
        } else {
            newStr += s.toLowerCase();
        }
    }
    return newStr;
}

function createTableOfContents(article: string): string {
    let table = "";
    for (const h1Raw of article.matchAll(/# ([\s\S])*?(?=([^#]# |$))/g)) {
        const h1 = h1Raw
            .toString()
            .split("\n")
            .find((val) => val.startsWith("# "))
            .replace(/^# /, "");
        table += `- [${h1}](#${urify(h1)})\n`;
        for (const h2Raw of h1Raw
            .toString()
            .matchAll(/## ([\s\S])*?(?=([^#]## |$|[^#]# ))/g)) {
            const h2 = h2Raw
                .toString()
                .split("\n")
                .find((val) => val.startsWith("## "))
                .replace(/^## /, "");
            table += `\t- [${h2}](#${urify(h2)})\n`;
            for (const h3Raw of h2Raw
                .toString()
                .matchAll(/### ([\s\S])*?(?=([^#]### |$|[^#]#?# ))/g)) {
                const h3 = h3Raw
                    .toString()
                    .split("\n")
                    .find((val) => val.startsWith("### "))
                    .replace(/^### /, "");
                table += `\t\t- [${h3}](#${urify(h3)})\n`;
            }
        }
    }

    return table;
}

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

    markdownArticle.value = markdownParser.render(`# Content
${createTableOfContents(props.article)}
${props.article}`);

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
