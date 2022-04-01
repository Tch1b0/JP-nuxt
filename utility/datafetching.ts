import { Profile } from "~~/server/classes/github";
import { Article } from "~~/server/classes/project";

export interface Project {
    id: number;
    name: string;
    description: string;
    url: string;
    topics: string[];
    article?: Article;
}

export async function getProject(id: number | string) {
    return await getFromApi<Project>(`project-${id}`, `project/${id}`);
}

export async function getArticle(id: number | string) {
    return await getFromApi<Article>(`article-${id}`, `article/${id}`);
}

export async function getProjects(): Promise<Project[]> {
    return await getFromApi<Project[]>("projects", "projects");
}

export async function getProfile(): Promise<Profile> {
    return await getFromApi<Profile>("profile", "profile");
}

export async function getArticles(): Promise<Article[]> {
    return await getFromApi<Article[]>("article", "article");
}

export async function getProjectMeta(): Promise<Project[]> {
    return await getFromApi<Project[]>("project-meta", "projects-meta");
}

export async function getProjectIds(): Promise<number[]> {
    return await getFromApi<number[]>("project-ids", "project-ids");
}

/**
 * request a ressource from the local API
 * @param key the key of the request
 * @param route the route starting from `/api/`
 *
 * @example
 * ```ts
 * getFromApi<number>("count", "count/value");
 * ```
 * => requests `<localhost>/api/count/value` and returns a number
 */
async function getFromApi<Response>(key: string, route: string) {
    const response = await useAsyncData<Response>(key, () =>
        $fetch(`/api/${route}`),
    );

    return response.data.value;
}
