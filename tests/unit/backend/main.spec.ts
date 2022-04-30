import { expect } from "chai";
import { Project } from "~~/server/classes/project";
import { User } from "~~/server/classes/user";
import Router from "~~/server/router";
import ProjectCollection from "~~/server/classes/projectCollection";

describe("Test Backend", () => {
    it("Test User", () => {
        const credentials = {
            username: "TestUser",
            password: "TestPassword",
        };

        const user = new User(
            credentials.username,
            credentials.password,
            false,
        );

        expect(user.username).to.equal(credentials.username);

        expect(user.password).not.to.equal(credentials.password);
        expect(user.comparePassword(credentials.password)).to.be.true;
    });

    // TODO: enhance Router test through mocks
    it("Test Router", () => {
        const router = new Router();

        // Router should have handlers for GET, POST, PATCH, PUT and DELETE
        expect(router.handlers.size).to.equal(5);
    });

    it("Test ProjectCollection", () => {
        const pc = new ProjectCollection([], false, false);

        expect(pc.saveable).to.equal(false);
        expect(pc.projects.length).to.equal(0);
        const newProject = new Project(
            1234,
            "test",
            "description",
            "https://example.com",
            "TypeScript",
            [],
        );
        pc.projects.push(newProject);
        expect(pc.projects.length).to.equal(1);
        expect(pc.projects[0]).to.be.instanceOf(Project);
        expect(pc.projects[0].id).to.equal(1234);
    });
});
