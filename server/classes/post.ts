export default class Post {
    projectId: number;
    article: string;
    images: string[];
    views: number;
    pubDate: Date;

    constructor(
        projectId: number,
        article: string,
        images: string[],
        views: number,
        pubDate: Date = new Date(),
    ) {
        this.projectId = projectId;
        this.article = article;
        this.images = images;
        this.views = views;
        this.pubDate = pubDate;
    }

    /*
     * A unique id for the post
     */
    get id() {
        return this.projectId;
    }

    async viewed() {
        this.views++;
    }

    public static fromJSON(json: string | object): Post {
        if (typeof json === "string") json = JSON.parse(json);

        return new Post(
            json["project-id"],
            json["article"],
            json["images"],
            json["views"],
            new Date(json["pub-date"]),
        );
    }

    public toJSON(): object {
        return {
            "project-id": this.projectId,
            article: this.article,
            images: this.images,
            views: this.views,
            "pub-date": this.pubDate,
        };
    }
}
