import { Profile } from "~~/server/classes/github";
import { Article } from "~~/server/classes/project";

export interface Project {
    id: number;
    name: string;
    description: string;
    url: string;
    language: string;
    topics: string[];
    article?: Article;
}

function articleResponseToArticle(article: Article): Article | undefined {
    if (article === undefined || article === null) return undefined;
    return {
        content: article.content,
        images: article.images,
        publishDate: new Date(article["publish-date"]),
        viewCount: article["view-count"],
    };
}

export async function getProject(id: number | string): Promise<Project> {
    const project = await getFromApi<Project>(`project-${id}`, `project/${id}`);

    return project;
}

export async function getProjects(): Promise<Project[]> {
    const projects = await getFromApi<Project[]>("projects", "projects");

    return [...projects];
}

export async function getProfile(): Promise<Profile> {
    return await getFromApi<Profile>("profile", "profile");
}

export async function getAbout(): Promise<string> {
    return await getFromApi<string>("about", "about");
}

export async function getProjectMeta(): Promise<Project> {
    const project = await getFromApi<Project>("project-meta", "projects-meta");
    return project;
}

export async function getProjectMetas(): Promise<Project[]> {
    const projects = await getFromApi<Project[]>(
        "project-metas",
        "project-metas",
    );

    return [...projects];
}

export async function getProjectIds(): Promise<number[]> {
    return await getFromApi<number[]>("project-ids", "project-ids");
}

function ensureExtendsObject(obj: any): obj is object {
    return true;
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
 *
 * @returns the response of the request as the type `Response`
 */
async function getFromApi<Response extends object | string | number>(
    key: string,
    route: string,
) {
    const response = await useAsyncData<Response>(
        key,
        () => $fetch(`/api/${route}`),
        {
            transform(data) {
                // this is a special case that is used for parsing articles into the object the right way
                // it is kinda hard to read, so
                // TODO: simplify all of this

                // skip if the data is just a normal value
                if (typeof data === "string" || typeof data === "number") {
                    return data;
                }
                // if this data is an array, it might contain articles, so look through it
                else if (data instanceof Array) {
                    for (const val of data) {
                        if ("article" in val) {
                            val["article"] = articleResponseToArticle(
                                val["article"],
                            );
                        }
                    }
                } else if (ensureExtendsObject(data) && "article" in data) {
                    // ensure typescript that the `article` key IS contained
                    const obj: Response | { article: Article } = data;
                    data["article"] = articleResponseToArticle(obj["article"]);
                }
                return data;
            },
        },
    );

    return response.data.value;
}
