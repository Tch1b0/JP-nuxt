import Post from "./post";

export default class PostCollection {
    posts: Post[];

    constructor(posts?: Post[]) {
        this.posts = posts || [];
    }

    getByKey(key: number) {
        return this.posts.filter((post) => post.key === key);
    }
}
