export default class Post {
    projectId: number;
    article: string;
    images: string[];

    constructor(projectId: number, article: string, images: string[]) {
        this.projectId = projectId;
        this.article = article;
        this.images = images;
    }

    /*
     * A unique key for the post
     */
    get key() {
        return this.projectId;
    }

    public static fromJSON(json: string | object): Post {
        if (typeof json === "string") json = JSON.parse(json);

        return new Post(json["project-id"], json["article"], json["images"]);
    }

    public toJSON(): object {
        return {
            "project-id": this.projectId,
            article: this.article,
            images: this.images,
        };
    }
}
