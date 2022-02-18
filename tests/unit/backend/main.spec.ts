import { expect } from "chai";
import Post from "../../../server/classes/post";
import { User } from "../../../server/classes/user";

describe("Test Backend", () => {
    it("Test User", () => {
        const credentials = {
            username: "TestUser",
            password: "TestPassword",
        };

        const user = new User(credentials.username, credentials.password);

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
        const postJSON = {
            "project-id": postInfo.projectId,
            article: postInfo.article,
            images: postInfo.images,
            views: postInfo.views,
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
        postJSON.views += 1;
        expect(post.toJSON()).to.deep.equal(postJSON);
        expect(Post.fromJSON(postJSON).toJSON()).to.deep.equal(postJSON);
    });
});
