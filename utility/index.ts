import { Remarkable } from "remarkable";
import { Repository } from "~~/server/classes/github";
import { Post } from "./datafetching";

export * from "./datafetching";

export function getPostFromRepo(repo: Repository, posts: Post[]) {
    return posts.find((post) => post["project-id"] === repo.id);
}

export function getRepoFromPost(post: Post, repos: Repository[]) {
    return repos.find((repo) => repo.id === post["project-id"]);
}

export function colorFromLang(lang: string): string | undefined {
    const colors: Map<string, string> = new Map([
        ["go", "cyan"],
        ["python", "blue"],
        ["vue", "lime"],
        ["typescript", "teal"],
        ["crystal", "black"],
        ["ruby", "red"],
        ["html", "orange"],
        ["javascript", "yellow"],
        ["c++", "pink"],
        ["php", "blue"],
        ["java", "brown"],
    ]);
    return colors.get(lang);
}

export function getAuthCookie() {
    return useCookie("Authorization", {
        maxAge: 60 * 60 * 24 * 30,
        secure: true,
        path: "/",
    });
}

/*
 * Validate that the current User is logged in
 */
export async function validate(): Promise<boolean> {
    const auth = getAuthCookie();
    if (auth.value === undefined) return false;

    const token = auth.value.replace("Bearer ", "");
    let valid: boolean;
    await $fetch("/api/validate", { method: "POST", body: { token } })
        .then(() => (valid = true))
        .catch(() => (valid = false));

    return valid;
}

export function basicMdToHtml(markdownContent: string): string {
    return new Remarkable().render(markdownContent);
}
