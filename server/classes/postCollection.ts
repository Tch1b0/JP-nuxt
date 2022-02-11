import Post from "./post";
import fs from "fs";

export default class PostCollection {
    posts: Post[];
    isProduction: boolean;

    constructor(posts?: Post[]) {
        if (posts) this.posts = posts;
        this.isProduction = process.env["NODE_ENV"] === "production";
        this.load();
        this.save();
    }

    save() {
        if (!this.isProduction) return;
        if (!fs.existsSync("./data")) fs.mkdirSync("./data");

        fs.writeFileSync(
            "./data/posts.json",
            JSON.stringify(this.posts.map((post) => post.toJSON())),
        );
    }

    load() {
        if (!fs.existsSync("./data/posts.json")) return;

        const data = fs.readFileSync("./data/posts.json").toString();
        if (data.length > 3) {
            const filePosts: Post[] = JSON.parse(data).map((json: Object) =>
                Post.fromJSON(json),
            );
            for (const post of filePosts) {
                if (!this.postInCollection) this.posts.push(post);
            }
        }
    }

    postInCollection(post: Post): boolean {
        return this.posts.some((other) => other.id === post.id);
    }

    add(post: Post) {
        // Only add post if there is no other with the same id
        if (!this.postInCollection(post)) this.posts.push(post);
        this.save();
    }

    remove(post: Post) {
        this.posts = this.posts.filter((other) => other.id !== post.id);
        this.save();
    }

    /*
     * From lowest to biggest number
     */
    sort() {
        this.posts.sort((a, b) => a.views - b.views);
    }

    /*
     * From biggest to lowest number
     */
    reverseSort() {
        this.posts.sort((a, b) => b.views - a.views);
    }

    getById(id: number) {
        return this.posts.filter((post) => post.id === id);
    }
}
