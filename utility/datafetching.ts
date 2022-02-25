import { Profile, Repository } from "~~/server/classes/github";

export interface Post {
    "project-id": number;
    article: string;
    images: string[];
    views: number;
}

export async function getRepo(id: number | string) {
    return await getFromApi<Repository>("repository", `repo/${id}`);
}

export async function getPost(id: number | string) {
    return await getFromApi<Post>("post", `post/${id}`);
}

export async function getRepos(): Promise<Repository[]> {
    return await getFromApi<Repository[]>("repositories", "repos");
}

export async function getProfile(): Promise<Profile> {
    return await getFromApi<Profile>("profile", "profile");
}

export async function getPosts(): Promise<Post[]> {
    return await getFromApi<Post[]>("posts", "posts");
}

export async function getPostIds(): Promise<number[]> {
    return await getFromApi<number[]>("post-ids", "post-ids");
}

/**
 * Request a ressource from the local API
 * @param key The key of the request
 * @param route the route starting from `/api/`
 *
 * ### Example:
 * ```ts
 * getFromApi<number>("count", "count/value");
 * ```
 * => Requests `<localhost>/api/count/value` and returns a number
 */
async function getFromApi<Response>(key: string, route: string) {
    const response = await useAsyncData<Response>(key, () =>
        $fetch(`/api/${route}`),
    );

    return response.data.value;
}
