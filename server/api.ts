import GitHub from "./classes/github";
import Post from "./classes/post";
import PostCollection from "./classes/postCollection";
import Router, { sendJson } from "./router";
import { IncomingMessage, ServerResponse } from "http";
import { useBody } from "h3";
import { User } from "./classes/user";

const app = new Router();
const admin = new User(
    process.env["JP_USERNAME"] || "TestUser",
    process.env["JP_PASSWORD"] || "TestPassword",
);
admin.genToken();

const github = new GitHub("Tch1b0");
const postCollection = new PostCollection([
    new Post(
        355929028,
        `# What is a BattleSnake?

## Non-technical View

A BattleSnake is a bot that competes against other bots in the famous [snake game](https://en.wikipedia.org/wiki/Snake_(video_game_genre)).

## Technical View

A BattleSnake is a http-Server with the endpoints \`/start\`, \`/move\` and \`/end\`. The BattleSnake Servers send a new request each turn, containing all the
nessecary information.

## Example Response

\`\`\`json
{
    "move": "up",
    "shout": "WHY ARE WE SHOUTING?"
}
\`\`\`
# Deconstructing Data
Deconstructing data is **super easy**, thanks to the great interfaces in go!


### JSON request

\`\`\`json
{
    "id": "game-00fe20da-94ad-11ea-bb37",
    "ruleset": {
        "name": "standard",
        "version": "v.1.2.3"
    },
    "timeout": 500
}
\`\`\`

### Matching interfaces for deconstruction in go

\`\`\`go
type Game struct {
	Id      string  \`json:"id"\`
	Ruleset Ruleset \`json:"ruleset"\`
	Timeout int     \`json:"timeout"\`
}

type Ruleset struct {
	Name    string \`json:"name"\`
	Version string \`json:"version"\`
}
\`\`\`

# What I learned

- how interfaces work in go
- http servers in go
- deconstructing json objects to interfaces in go
- how apis work and how I can make them
`,
        [
            "https://pbs.twimg.com/profile_images/1407776521759051780/MNn7hJTM_400x400.jpg",
            "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgblobscdn.gitbook.com%2Fassets%252F-M76ZsDOynN6TRQo1L1E%252F-MVwmCvFAbWdo1E5OJAS%252F-MVwxA3PZGn7vxSSD52p%252FConstrictor_Game.png%3Falt%3Dmedia%26token%3Daa551116-6b0b-4b96-924f-b1d0672d5cc2&f=1&nofb=1",
            "https://blog.battlesnake.com/content/images/2021/06/MediumSocial-1.png",
        ],
        0,
    ),
]);

function idFromReq(req: IncomingMessage) {
    return Number(req.url.split("/")[2]);
}

app.get("/", (req, res) => {
    res.end("Ok");
});
app.get("/repos", async (req, res) => {
    sendJson(res, await github.getRepos());
});
app.get("/repo", async (req, res) => {
    const id = idFromReq(req);
    const repo = (await github.getRepo(id))[0];
    sendJson(res, repo);
});
app.get("/profile", async (req, res) => {
    sendJson(res, await github.getProfile());
});
app.get("/posts", (req, res) => {
    sendJson(res, postCollection.posts);
});
app.get("/post", (req, res) => {
    const id = idFromReq(req);
    const post = postCollection.getById(id)[0];
    post.viewed();
    sendJson(res, post.toJSON());
});
app.get("/post-ids", (req, res) => {
    sendJson(
        res,
        postCollection.posts.map((post) => post.id),
    );
});
app.get("/viewed/:id", (req, res) => {
    const id = idFromReq(req);
    const post = postCollection.getById(id)[0];
    post.viewed();
    res.end("Ok");
});

app.post("/login", async (req, res) => {
    let body = await useBody(req);

    const username = body.username._value;
    const password = body.password._value;

    if (username === admin.username && admin.comparePassword(password)) {
        sendJson(res, { token: admin.token });
    } else {
        res.statusCode = 401;
        res.end();
    }
});

app.post("/validate", async (req, res) => {
    const { token, "respond-json": respondJson } = await useBody<{
        token: string;
        "respond-json"?: boolean;
    }>(req);

    if (respondJson) {
        sendJson(res, {
            valid: admin.token === token,
        });
    } else {
        res.statusCode = admin.token === token ? 200 : 401;
        res.end();
    }
});

export default (req: IncomingMessage, res: ServerResponse) =>
    app.handle(req, res);
