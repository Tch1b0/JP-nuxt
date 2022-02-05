import { validate } from "~~/utility";

export default defineNuxtRouteMiddleware(async () => {
    // Validate that the User is logged in and
    // Redirect them if not
    if (!(await validate())) return "/admin/login";
});
