import GitHub, { Repository } from "./classes/github";
import Post from "./classes/post";
import PostCollection from "./classes/postCollection";
import Router, {
    sendJson,
    sendUnauthorized,
    idFromReq,
    sendError,
} from "./router";
import { IncomingMessage, ServerResponse } from "http";
import { useBody } from "h3";
import { User } from "./classes/user";
import { ProjectCollection } from "./classes/projectCollection";
import { Article } from "./classes/project";

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
export const projectCollection = new ProjectCollection();

/**
 * validate that the user is authenticated
 * @param req the request object of the request
 * @returns whether the user is authenticated
 */
async function validate(req: IncomingMessage): Promise<boolean> {
    // get token from body and compare it with the admin-token
    return (await useBody<{ token: string }>(req)).token === admin.token;
}

github.on("reposFetch", (repos: Repository[]) => {
    projectCollection.updateRepositories(repos); // update the post collection with the new repositories
    projectCollection.save(); // speichere die Projekte in der Datei ab (nur wenn es sich um einen produktiven Server handelt)
});

app.get("project", (req, res) => {
    const id = idFromReq(req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(res, "Project not found", 404);
        return;
    }
    sendJson(res, project.toJSON());
});

app.get("projects", (req, res) => {
    sendJson(res, projectCollection.toJSON());
});

app.get("project-ids", (req, res) => {
    sendJson(
        res,
        projectCollection.toJSON().map((project) => project.id),
    );
});

app.get("project-meta", (req, res) => {
    const id = idFromReq(req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(res, "Project not found", 404);
        return;
    }
    sendJson(res, project.getMeta());
});

app.get("project-metas", (req, res) => {
    sendJson(
        res,
        projectCollection.projects.map((project) => project.getMeta()),
    );
});

app.get("projects", (req, res) => {
    sendJson(
        res,
        projectCollection.projects.map((project) => project.toJSON()),
    );
});

app.post("article", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }
    const projectId = idFromReq(req);
    const article = await useBody<Article>(req);
    const project = projectCollection.getProjectById(projectId);
    project.addArticle(article);
});

app.put("article", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }
    const projectId = idFromReq(req);
    const article = await useBody<Article>(req);
    const project = projectCollection.getProjectById(projectId);
    project.addArticle(article);
});

app.get("/", (_, res) => {
    res.end("Ok");
});

app.get("/profile", async (_, res) => {
    sendJson(res, await github.getProfile());
});

app.post("/login", async (req, res) => {
    const { username, password } = await useBody<{
        username: string;
        password: string;
    }>(req);

    if (username === admin.username && admin.comparePassword(password)) {
        sendJson(res, { token: admin.token });
    } else {
        sendUnauthorized(res);
    }
});

app.post("/viewed", (req, res) => {
    const id = idFromReq(req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(res, "Project not found", 404);
        return;
    }
    project.viewed();
    res.end();
});

app.post("/validate", async (req, res) => {
    res.statusCode = (await validate(req)) ? 200 : 401;
    res.end();
});

app.delete("article", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }
    const projectId = idFromReq(req);
    const project = projectCollection.getProjectById(projectId);
    project.deleteArticle();
});

export default async (req: IncomingMessage, res: ServerResponse) =>
    await app.handle(req, res);
