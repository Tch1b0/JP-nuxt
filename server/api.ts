import GitHub, { Repository } from "./classes/github";
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
    projectCollection.updateRepositories(repos);
    projectCollection.save();
});

github.fetchRepos();

app.get("/", (_, res) => {
    res.end("Ok");
});

app.get("/project", (req, res) => {
    const id = idFromReq(req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(res, "Project not found", 404);
        return;
    }
    sendJson(res, project.toJSON());
});

app.get("/project-ids", (req, res) => {
    sendJson(
        res,
        projectCollection.toJSON().map((project) => project.id),
    );
});

app.get("/project-meta", (req, res) => {
    const id = idFromReq(req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(res, "Project not found", 404);
        return;
    }
    sendJson(res, project.getMeta());
});

app.get("/project-metas", (req, res) => {
    sendJson(
        res,
        projectCollection.projects.map((project) => project.getMeta()),
    );
});

app.get("/projects", (req, res) => {
    sendJson(res, projectCollection.toJSON());
});

app.post("/article", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }
    const projectId = idFromReq(req);
    const article = await useBody<Article>(req);
    console.log("Project id: ", projectId);
    const project = projectCollection.getProjectById(projectId);
    console.log("Project: ", project);
    project.addArticle(article);
});

app.put("/article", async (req, res) => {
    if (!(await validate(req))) {
        sendUnauthorized(res);
        return;
    }
    const projectId = idFromReq(req);
    const { content, images } = await useBody<{
        content: string;
        images: string[];
    }>(req);
    const project = projectCollection.getProjectById(projectId);
    project.updateArticle(content, images);
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

app.delete("/article", async (req, res) => {
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
