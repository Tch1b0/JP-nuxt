export default defineNuxtRouteMiddleware(async (to) => {
    let id: number;
    try {
        id = Number(to.params.project);
    } catch {
        return "/projects";
    }
    const repoIds = await $fetch<number[]>("/api/repo-ids");

    if (!repoIds.some((repoId) => repoId === id)) {
        return "/projects";
    }
});
