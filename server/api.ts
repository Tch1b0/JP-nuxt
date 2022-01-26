import type { IncomingMessage, ServerResponse } from "http";
import { getProfile, getPublicRepos } from "./github";

const username: string = "Tch1b0";

async function handleRoute(req: IncomingMessage, res: ServerResponse) {
    const handlers = {
        async "/repos"() {
            res.end(JSON.stringify(await getPublicRepos(username)));
        },
        async "/profile"() {
            res.end(JSON.stringify(await getProfile(username)));
        },
    };

    if (Object.keys(handlers).includes(req.url)) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        await handlers[req.url]();
    } else {
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 404;
        res.end(`error: route '${req.url}' does not exist`);
    }
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("charset", "utf-8");
    await handleRoute(req, res);
};
