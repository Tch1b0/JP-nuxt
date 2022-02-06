export default defineNuxtRouteMiddleware(async (to) => {
    let id: number;
    try {
        id = Number(to.params.project);
    } catch {
        return "/projects";
    }
    const postIds = await $fetch<number[]>("/api/post-ids");

    if (!postIds.includes(id)) {
        return "/projects";
    }
});
