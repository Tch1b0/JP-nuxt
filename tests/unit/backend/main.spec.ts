import { expect } from "chai";
import Post from "@/server/classes/post";
import { User } from "@/server/classes/user";
import Router from "~~/server/router";
import PostCollection from "~~/server/classes/postCollection";

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

    it("Test Post", () => {
        const postInfo = {
            projectId: 1234,
            article: "Test",
            images: [],
            views: 0,
        };
        const post = new Post(
            postInfo.projectId,
            postInfo.article,
            postInfo.images,
            postInfo.views,
        );

        expect(post.views).to.equal(postInfo.views);
        post.viewed();
        expect(post.views).to.equal(postInfo.views + 1);
        // postJSON.views += 1;
        // expect(Post.fromJSON(postJSON).toJSON()).to.deep.equal(postJSON);
    });

    // TODO: enhance Router test through mocks
    it("Test Router", () => {
        const router = new Router();

        // Router should have handlers for GET, POST, PATCH, PUT and DELETE
        expect(router.handlers.size).to.equal(5);
    });

    it("Test PostCollection", () => {
        const pc = new PostCollection([], false, false);

        expect(pc.saveable).to.equal(false);
        expect(pc.posts.length).to.equal(0);
        const newPost = new Post(1234, "test", [], 0);
        pc.add(newPost);
        expect(pc.posts.length).to.equal(1);
        expect(pc.posts[0]).to.be.instanceOf(Post);
        pc.remove(newPost);
        expect(pc.posts.length).to.equal(0);
    });
});
