import Post from "./post";

export default class PostCollection {
    posts: Post[];

    constructor(posts?: Post[]) {
        this.posts = posts || [];
    }

    add(post: Post) {
        this.posts.push(post);
    }

    remove(post: Post) {
        this.posts = this.posts.filter((other) => other.id !== post.id);
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
