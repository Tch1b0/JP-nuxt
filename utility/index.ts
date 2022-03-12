import { Remarkable } from "remarkable";
import { Repository } from "~~/server/classes/github";
import { Post, PostMetadata } from "./datafetching";

export * from "./datafetching";

export function getPostFromRepo<T = Post | PostMetadata>(
    repo: Repository,
    posts: T[],
): T {
    return posts.find((post) => post["project-id"] === repo.id);
}

export function getRepoFromPost(
    post: Post | PostMetadata,
    repos: Repository[],
): Repository {
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

/**
 * validate that the current User is logged in
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

/**
 * get the views of a post to a repository or -1
 * @param repo the repo to evaluate the views from
 * @returns the views or -1
 */
export function viewsOrNot<T = Post | PostMetadata>(
    repo: Repository,
    posts: T[],
): number {
    const postIds = posts.map((post: T) => post["project-id"]);
    return postIds.includes(repo.id)
        ? getPostFromRepo(repo, posts)["views"]
        : -1;
}

/**
 * sorts a repository array from: *has no post* -> *has post* -> *has most views*
 * @param a the first repostiory
 * @param b the second repository
 * @returns the difference between `a` and `b`
 */
export function projectSort<T = Post | PostMetadata>(
    a: Repository,
    b: Repository,
    posts: T[],
): number {
    const aValue = viewsOrNot(a, posts);
    const bValue = viewsOrNot(b, posts);

    return aValue - bValue;
}
