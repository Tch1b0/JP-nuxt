export default defineNuxtRouteMiddleware(async (to) => {
    await $fetch(`/api/viewed/${to.params.project}`);
});
