export default class Post {
    projectId: number;
    article: string;
    images: string[];
    views: number;

    constructor(
        projectId: number,
        article: string,
        images: string[],
        views: number,
    ) {
        this.projectId = projectId;
        this.article = article;
        this.images = images;
        this.views = views;
    }

    /*
     * A unique id for the post
     */
    get id() {
        return this.projectId;
    }

    viewed() {
        this.views++;
    }

    public static fromJSON(json: string | object): Post {
        if (typeof json === "string") json = JSON.parse(json);

        return new Post(
            json["project-id"],
            json["article"],
            json["images"],
            json["views"],
        );
    }

    public toJSON(): object {
        return {
            "project-id": this.projectId,
            article: this.article,
            images: this.images,
            views: this.views,
        };
    }
}
