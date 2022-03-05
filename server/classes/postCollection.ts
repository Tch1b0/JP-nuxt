import Post from "./post";
import fs from "fs";

/**
 * holds and handels the posts
 */
export default class PostCollection {
    posts: Post[];
    isProduction: boolean;

    /**
     * create a new post-collection
     * @param posts the initial posts to load
     */
    constructor(posts?: Post[]) {
        this.posts = posts ?? [];
        this.isProduction = process.env["NODE_ENV"] === "production";
        this.load();
        this.save();
    }

    /**
     * save the post-collection to a JSON file
     */
    save() {
        if (!this.isProduction) return;
        if (!fs.existsSync("./data")) fs.mkdirSync("./data");

        fs.writeFileSync(
            "./data/posts.json",
            JSON.stringify(this.posts.map((post) => post.toJSON())),
        );
    }

    /**
     * load the post-collection from a JSON file
     */
    load() {
        if (!fs.existsSync("./data/posts.json")) return;

        const data = fs.readFileSync("./data/posts.json").toString();
        if (data.length > 3) {
            const filePosts: Post[] = JSON.parse(data).map((json: object) =>
                Post.fromJSON(json),
            );
            for (const post of filePosts) {
                if (!this.postInCollection(post)) this.posts.push(post);
            }
        }
    }

    /**
     * check whether a certain post is already represented in the collection
     * @param post the post to check
     * @returns whether the post exists in this post-collection
     */
    postInCollection(post: Post): boolean {
        return this.posts.some((other) => other.id === post.id);
    }

    /**
     * add a post to the post-collection
     * @param post the post to add
     */
    add(post: Post) {
        // Only add post if there is no other with the same id
        if (!this.postInCollection(post)) this.posts.push(post);
        this.save();
    }

    /**
     * remove a certain post from the post-collection
     * @param post the post to remove
     */
    remove(post: Post) {
        this.posts = this.posts.filter((other) => other.id !== post.id);
        this.save();
    }

    /**
     * from lowest to biggest number
     */
    sort() {
        this.posts.sort((a, b) => a.views - b.views);
    }

    /**
     * From biggest to lowest number
     */
    reverseSort() {
        this.posts.sort((a, b) => b.views - a.views);
    }

    /**
     * get a certain post by its id
     * @param id the id to search for
     * @returns a post on success or undefined on failure
     */
    getById(id: number): Post | undefined {
        return this.posts.find((post) => post.id === id);
    }
}
