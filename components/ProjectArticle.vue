<template>
    <div class="bg-transparent m-5 post-article" v-html="markdownContent"></div>
</template>

<script setup lang="ts">
import { Remarkable } from "remarkable";
import hljs from "highlight.js";

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});
watch(props, () => render());

const markdownContent = reactive(ref(""));

function urify(str: string): string {
    let newStr = "";
    for (const s of str) {
        if (/ /.test(s)) {
            newStr += "-";
        } else if (/[^\.\!\?\*]/.test(s)) {
            newStr += s.toLowerCase();
        }
    }
    return newStr;
}

function createTableOfContents(content: string): string {
    // create a new table
    let table = "";

    // iterate over every level 1 heading
    for (const h1Raw of content.matchAll(/# ([\s\S])*?(?=([^#]# |$))/g)) {
        // Get the content of the title
        const h1 = h1Raw
            .toString()
            .split("\n")
            .find((val) => val.startsWith("# "))
            .replace(/^# /, "");

        // append the title to the table linked with an urified version of itself
        table += `- [${h1}](#${urify(h1)})\n`;

        // iterate over every level 2 heading
        for (const h2Raw of h1Raw
            .toString()
            .matchAll(/## ([\s\S])*?(?=([^#]## |$|[^#]# ))/g)) {
            // Get the content of the title
            const h2 = h2Raw
                .toString()
                .split("\n")
                .find((val) => val.startsWith("## "))
                .replace(/^## /, "");

            // append the title to the table linked with an urified version of itself
            table += `\t- [${h2}](#${urify(h2)})\n`;

            // iterate over every level 3 heading
            for (const h3Raw of h2Raw
                .toString()
                .matchAll(/### ([\s\S])*?(?=([^#]### |$|[^#]#?# ))/g)) {
                // Get the content of the title
                const h3 = h3Raw
                    .toString()
                    .split("\n")
                    .find((val) => val.startsWith("### "))
                    .replace(/^### /, "");

                // append the title to the table linked with an urified version of itself
                table += `\t\t- [${h3}](#${urify(h3)})\n`;
            }
        }
    }

    return table;
}

function addIdsToHeadings(content: string): string {
    for (const heading of content.matchAll(/<h[1-3]>.*?<\/h[1-3]>/g)) {
        const hNum = Number(
            heading.toString().replaceAll(/<h|>.*?<\/h[1-3]>/g, ""),
        );
        const title = heading.toString().replaceAll(/<\/?h[1-3]>/g, "");
        content = content.replace(
            heading.toString(),
            heading
                .toString()
                .replace(`<h${hNum}>`, `<h${hNum} id="${urify(title)}">`),
        );
    }

    return content;
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

    const htmlArticle = markdownParser.render(`# Content
${createTableOfContents(props.content)}
${props.content}`);

    markdownContent.value = addIdsToHeadings(htmlArticle);

    // Add a horizontal line beneath every </h1>
    markdownContent.value = markdownContent.value.replace(
        /<\/h1>/g,
        "</h1>\n<hr>",
    );
}

render();
</script>

<style>
html {
    @apply scroll-smooth;
}

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
em,
li {
    @apply text-gray-200 mt-1 bg-transparent;
}
strong {
    @apply text-orange-300 mt-1 bg-transparent;
}
ul {
    @apply ml-5 odd:list-disc even:list-[circle];
}
code {
    @apply bg-gray-600 pl-1 pr-1 rounded-sm whitespace-pre-wrap;
}
pre,
pre > code {
    @apply mt-3 mb-3 rounded-sm bg-slate-900 p-1 text-xs sm:text-sm md:text-base;
}
hr {
    @apply border-gray-600 mb-3;
}
</style>
