import { Repository } from "~~/server/classes/github";

export interface Post {
    "project-id": number;
    article: string;
    images: string[];
    views: number;
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
