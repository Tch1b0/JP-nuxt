import { Repository } from "~~/server/classes/github";

export interface Post {
    "project-id": number;
    article: string;
    images: string[];
    views: number;
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
        ["c[++", "pink"],
        ["php", "blue"],
        ["java", "brown"],
    ]);
    return colors.get(lang);
}

export async function getRepos(): Promise<Repository[]> {
    const response = await useAsyncData<Repository[]>("repositories", () =>
        $fetch("/api/repos"),
    );

    return response.data.value;
}

export async function getPosts(): Promise<Post[]> {
    const response = await useAsyncData<Post[]>("posts", () =>
        $fetch("/api/posts"),
    );

    return response.data.value;
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
