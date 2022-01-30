import type { IncomingMessage, ServerResponse } from "http";
import GitHub from "./github";
import Post from "./post";
import PostCollection from "./postCollection";
import { getIdFromParams, splitUrl } from "./utility";

const github = new GitHub("Tch1b0");
const postCollection = new PostCollection([
    new Post(
        355929028,
        `# What is a BattleSnake?
## Non-technical view
A BattleSnake is a bot that competes against other bots in the famous [snake game](https://en.wikipedia.org/wiki/Snake_(video_game_genre)).

## Technical view
A BattleSnake is a http-Server with the endpoints \`/start\`, \`/move\` and \`/end\`. The BattleSnake Servers send a new request each turn, containing all the
nessecary information.

# Example response
\`\`\`json
{
    "move": "up",
    "shout": "WHY ARE WE SHOUTING?"
}
\`\`\`
        `,
        [
            "https://api.johannespour.de/post/MoGo/logo",
            "https://api.johannespour.de/post/MoGo/logo",
        ],
        0,
    ),
]);

const handlers = {
    async "/repos"(_: any) {
        return JSON.stringify(await github.getRepos());
    },
    async "/repo"(params: string[]) {
        const id = getIdFromParams(params);
        const repo = (await github.getRepo(id))[0];
        if (repo !== undefined) {
            return JSON.stringify(repo);
        } else {
            return 404;
        }
    },
    async "/profile"(_: any) {
        return JSON.stringify(await github.getProfile());
    },
    async "/posts"(_: any) {
        return JSON.stringify(postCollection.posts);
    },
    async "/post"(params: string[]) {
        const id = getIdFromParams(params);
        const post = postCollection.getById(id)[0];
        post.viewed();
        if (post !== undefined) {
            return JSON.stringify(post);
        } else {
            return 404;
        }
    },
    async "/post-ids"(_: any) {
        return JSON.stringify(postCollection.posts.map((post) => post.id));
    },
    async "/viewed"(params: string[]) {
        const id = getIdFromParams(params);
        const post = postCollection.getById(id)[0];
        if (post !== undefined) {
            return "";
        } else {
            return 404;
        }
    },
};

async function handleRoute(req: IncomingMessage, res: ServerResponse) {
    const { endpoint, params } = splitUrl(req.url);

    if (Object.keys(handlers).includes(endpoint)) {
        res.setHeader("Content-Type", "application/json");

        // response is string if data is sent or number if an error
        // occured and needs to be handled
        const response: string | number = await handlers[endpoint](params);
        if (typeof response === "string") {
            res.statusCode = 200;
            res.end(response);
        } else {
            res.statusCode = response;
            res.end();
        }
    } else {
        res.setHeader("Content-Type", "text/plain");
        res.statusCode = 404;
        res.end(
            `error: route '${
                req.url
            }' does not exist. Available endpoints: ${Object.keys(handlers)}`,
        );
    }
}

export default async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader("charset", "utf-8");
    await handleRoute(req, res);
};
