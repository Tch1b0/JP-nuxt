import { Repository } from "~~/server/classes/github";

export default defineNuxtRouteMiddleware(async (to) => {
    let id: number;
    try {
        id = Number(to.params.project);
    } catch {
        return "/projects";
    }
    const repos = await $fetch<Repository[]>("/api/repos");

    if (!repos.some((repo) => repo.id === id)) {
        return "/projects";
    }
});
