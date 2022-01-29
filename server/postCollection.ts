import Post from "./post";

export default class PostCollection {
    posts: Post[];

    constructor(posts?: Post[]) {
        this.posts = posts || [];
    }

    getById(id: number) {
        return this.posts.filter((post) => post.id === id);
    }
}
