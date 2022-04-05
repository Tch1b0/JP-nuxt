import { Project } from "~~/utility";

export default defineNuxtRouteMiddleware(async (to) => {
    let id: number;
    try {
        id = Number(to.params.project);
    } catch {
        return "/projects";
    }

    try {
        const project = await $fetch<Project>(`/api/project-meta/${id}`);
        if (project.article === undefined) {
            return "/projects";
        }
    } catch {
        return "/projects";
    }
});
