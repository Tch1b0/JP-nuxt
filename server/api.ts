import GitHub, { Repository } from "./classes/github";
import Router, {
    sendJson,
    sendUnauthorized,
    sendError,
    idFromReq,
} from "./router";
import { readBody, H3Event } from "h3";
import { User } from "./classes/user";
import ProjectCollection from "./classes/projectCollection";

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
async function validate(req: H3Event): Promise<boolean> {
    // get token from body and compare it with the admin-token
    return (await readBody<{ token: string }>(req)).token === admin.token;
}

github.on("reposFetch", (repos: Repository[]) => {
    projectCollection.updateRepositories(repos);
    projectCollection.save();
});

github.fetchRepos();

app.get("/", (e) => {
    e.res.end("Ok");
});

app.get("/project", (e) => {
    const id = idFromReq(e.req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(e.res, "Project not found", 404);
        return;
    }
    sendJson(e.res, project.toJSON());
});

app.get("/project-ids", (e) => {
    sendJson(
        e.res,
        projectCollection.toJSON().map((project) => project.id),
    );
});

app.get("/project-meta", (e) => {
    const id = idFromReq(e.req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(e.res, "Project not found", 404);
        return;
    }
    sendJson(e.res, project.getMeta());
});

app.get("/project-metas", (e) => {
    sendJson(
        e.res,
        projectCollection.projects.map((project) => project.getMeta()),
    );
});

app.get("/projects", (e) => {
    sendJson(e.res, projectCollection.toJSON());
});

app.post("/article", async (e) => {
    if (!(await validate(e))) {
        sendUnauthorized(e.res);
        return;
    }
    const {
        content,
        images,
        "project-id": projectId,
    } = await readBody<{
        content: string;
        images: string[];
        "project-id": number;
    }>(e);
    const project = projectCollection.getProjectById(projectId);
    project.addArticle(content, images);
    projectCollection.save();
    e.res.end("Ok");
});

app.put("/article", async (e) => {
    if (!(await validate(e))) {
        sendUnauthorized(e.res);
        return;
    }
    const {
        content,
        images,
        "project-id": projectId,
    } = await readBody<{
        content: string;
        images: string[];
        "project-id": number;
    }>(e);
    const project = projectCollection.getProjectById(projectId);
    project.updateArticle(content, images);
    projectCollection.save();
    e.res.end("Ok");
});

app.get("/profile", async (e) => {
    sendJson(e.res, await github.getProfile());
});

app.get("/about", async (e) => {
    e.res.end(admin.description);
});

app.post("/login", async (e) => {
    const { username, password } = await readBody<{
        username: string;
        password: string;
    }>(e);

    if (username === admin.username && admin.comparePassword(password)) {
        sendJson(e.res, { token: admin.token });
    } else {
        sendUnauthorized(e.res);
    }
});

app.post("/viewed", (e) => {
    const id = idFromReq(e.req);
    const project = projectCollection.getProjectById(id);
    if (!project) {
        sendError(e.res, "Project not found", 404);
        return;
    }
    project.viewed();
    e.res.end();
});

app.post("/validate", async (e) => {
    e.res.statusCode = (await validate(e)) ? 200 : 401;
    e.res.end();
});

app.delete("/article", async (e) => {
    if (!(await validate(e))) {
        sendUnauthorized(e.res);
        return;
    }
    const { "project-id": projectId } = await useBody<{ "project-id": number }>(
        e,
    );
    const project = projectCollection.getProjectById(projectId);
    project.deleteArticle();
    projectCollection.save();
    e.res.end("Ok");
});

export default eventHandler((e) => app.handle(e));
