import { validate } from "~~/utility";

export default defineNuxtRouteMiddleware(async (to) => {
    // if the user is not the admin, increase the view count
    if (!(await validate())) await $fetch(`/api/viewed/${to.params.project}`);
});
