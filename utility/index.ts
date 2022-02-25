import { CookieRef } from "nuxt3";
import { Remarkable } from "remarkable";
import { Repository } from "~~/server/classes/github";
import { Post } from "./datafetching";

export * from "./datafetching";

export function getPostFromRepo(repo: Repository, posts: Post[]): Post {
    return posts.find((post) => post["project-id"] === repo.id);
}

export function getRepoFromPost(post: Post, repos: Repository[]): Repository {
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

export function getAuthCookie(): CookieRef<string> {
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

    const token = auth.value.replace(/^Bearer /, "");
    let valid: boolean;
    await $fetch("/api/validate", { method: "POST", body: { token } })
        .then(() => (valid = true))
        .catch(() => (valid = false));

    return valid;
}

export function basicMdToHtml(markdownContent: string): string {
    return new Remarkable().render(markdownContent);
}

export const boolToInt = (bool: boolean) => (bool ? 1 : 0);

/**
 * Calls a callback every `days` days
 * @param callback The callback that should be called after the days passed
 * @param days How many days to wait
 */
export function setDayInterval(callback: () => void, days: number): void {
    let daysPassed = 0;
    const secondsOfDay = 24 * 60 * 60 * 1000;
    const timeoutCallback = () => {
        daysPassed++;
        if (daysPassed === days) {
            callback();
            daysPassed = 0;
        }
        setTimeout(() => timeoutCallback(), secondsOfDay);
    };

    setTimeout(() => timeoutCallback(), secondsOfDay);
}

export function calculateAge(birthdate: Date): number {
    const monthDifference = Date.now() - birthdate.getTime();
    const AgeDt = new Date(monthDifference);
    const year = AgeDt.getUTCFullYear();

    return Math.abs(year - 1970);
}
