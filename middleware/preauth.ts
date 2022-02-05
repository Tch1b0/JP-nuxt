export default defineNuxtRouteMiddleware(() => {
    const token = useCookie("Authorization").value;
    if (token === undefined) return navigateTo("/admin/login");
});
