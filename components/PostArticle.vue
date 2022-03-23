<template>
    <div class="bg-transparent m-5 post-article" v-html="markdownArticle"></div>
</template>

<script setup lang="ts">
import Remarkable from "remarkable";
import "assets/styles/post-article.css";
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
        } else if (/[^\.\!\?\*]/.test(s)) {
            newStr += s.toLowerCase();
        }
    }
    return newStr;
}

function createTableOfContents(article: string): string {
    // create a new table
    let table = "";

    // iterate over every level 1 heading
    for (const h1Raw of article.matchAll(/# ([\s\S])*?(?=([^#]# |$))/g)) {
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

function addIdsToHeadings(article: string): string {
    for (const heading of article.matchAll(/<h[1-3]>.*?<\/h[1-3]>/g)) {
        const hNum = Number(
            heading.toString().replaceAll(/<h|>.*?<\/h[1-3]>/g, ""),
        );
        const title = heading.toString().replaceAll(/<\/?h[1-3]>/g, "");
        article = article.replace(
            heading.toString(),
            heading
                .toString()
                .replace(`<h${hNum}>`, `<h${hNum} id="${urify(title)}">`),
        );
    }

    return article;
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
${createTableOfContents(props.article)}
${props.article}`);

    markdownArticle.value = addIdsToHeadings(htmlArticle);

    // Add a horizontal line beneath every </h1>
    markdownArticle.value = markdownArticle.value.replace(
        /<\/h1>/g,
        "</h1>\n<hr>",
    );
}

render();
</script>
