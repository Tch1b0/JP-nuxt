export default defineNuxtRouteMiddleware(async (to) => {
    let id: number;
    try {
        id = Number(to.params.project);
    } catch {
        return "/projects";
    }
    const projectIds = await $fetch<number[]>("/api/project-ids");

    console.log("Checking ids ", projectIds);
    if (!projectIds.includes(id)) {
        return "/projects";
    }
});
