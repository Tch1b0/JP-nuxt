import { validate } from "~~/utility";

export default defineNuxtRouteMiddleware(async (to) => {
    // if the user is not the admin, increase the view count
    const valid = await validate();
    if (!valid)
        await $fetch<void>(`/api/viewed/${to.params.project}`, {
            method: "POST",
        });
});
