import GitHub from "./classes/github";
import Post from "./classes/post";
import PostCollection from "./classes/postCollection";
import Router, { sendJson, sendUnauthorized, idFromReq } from "./router";
import { IncomingMessage, ServerResponse } from "http";
import { useBody } from "h3";
import { User } from "./classes/user";

const app = new Router();
const admin = new User(
    process.env["JP_USERNAME"] || "TestUser",
    process.env["JP_PASSWORD"] || "TestPassword",
);

export const github = new GitHub(process.env["GH_USERNAME"] || "Tch1b0");

const templatePosts =
    process.env["NODE_ENV"] === "production"
        ? undefined
        : [new Post(393093009, "test", [], 0)];
export const postCollection = new PostCollection(templatePosts);

/**
 * validate that the user is authenticated
 * @param req the request object of the request
 * @returns whether the user is authenticated
 */
async function validate(req: IncomingMessage): Promise<boolean> {
    // get token from body and compare it with the admin-token
    return (await useBody<{ token: string }>(req)).token === admin.token;
}

// GET requests

app.get("/", (_, res) => {
    res.end("Ok");
});
app.get("/repos", async (_, res) => {
    sendJson(res, await github.getRepos());
});
app.get("/repo", async (req, res) => {
    const id = idFromReq(req);
    const repo = await github.getRepo(id);
    sendJson(res, repo);
});
app.get("/profile", async (_, res) => {
    sendJson(res, await github.getProfile());
});
app.get("/posts", (_, res) => {
    sendJson(
        res,
        postCollection.posts.map((post) => post.toJSON()),
    );
});
app.get("/post", (req, res) => {
    const id = idFromReq(req);
    const post = postCollection.getById(id);
    sendJson(res, post.toJSON());
});
app.get("/repo-ids", async (_, res) => {
    sendJson(
        res,
        (await github.getRepos()).map((repo) => repo.id),
    );
});
app.get("/post-ids", (_, res) => {
    sendJson(
        res,
        postCollection.posts.map((post) => post.id),
    );
});
app.get("/posts-metadata", async (_, res) => {
    const repos = await github.getRepos();
    const postsMetadata = postCollection.posts.map((post) => {
        const jsonPost = post.toJSON();
        const repo = repos.find((repo) => repo.id === post.id);
        delete jsonPost["article"];
        delete jsonPost["images"];
        jsonPost["title"] = repo.name;
        jsonPost["description"] = repo.description;
        return jsonPost;
    });

    sendJson(res, postsMetadata);
});
app.get("/viewed", (req, res) => {
    const id = idFromReq(req);
    const post = postCollection.getById(id);
    post.viewed();
    postCollection.reverseSort();
    postCollection.save();
    res.end("Ok");
});

// POST requests

app.post("/login", async (req, res) => {
    const body = await useBody(req);

    const username = body.username;
    const password = body.password;

    if (username === admin.username && admin.comparePassword(password)) {
        sendJson(res, { token: admin.token });
    } else {
        sendUnauthorized(res);
    }
});

app.post("/validate", async (req, res) => {
    res.statusCode = (await validate(req)) ? 200 : 401;
    res.end();
});

app.post("/post", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }

    const {
        "project-id": projectId,
        article,
        images,
    } = await useBody<{
        "project-id": number;
        article: string;
        images: string[];
    }>(req);

    const newPost = new Post(projectId, article, images, 0);
    postCollection.add(newPost);
    sendJson(res, newPost.toJSON());
});

// PUT requests

app.put("/post", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }

    const {
        "project-id": projectId,
        article,
        images,
    } = await useBody<{
        "project-id": number;
        article: string;
        images: string[];
    }>(req);

    const post = postCollection.getById(projectId);

    if (post === undefined) {
        res.statusCode = 404;
        res.end();
    }

    post.article = article;
    post.images = images;

    sendJson(res, post.toJSON());
});

// DELETE requests

app.delete("/post", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }

    const { "project-id": projectId } = await useBody<{
        "project-id": number;
    }>(req);

    const post = postCollection.getById(projectId);
    if (post) {
        postCollection.remove(post);
        sendJson(res, post.toJSON());
    } else {
        res.statusCode = 404;
        res.end();
    }
});

export default (req: IncomingMessage, res: ServerResponse) =>
    app.handle(req, res);
