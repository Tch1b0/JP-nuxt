import { Repository } from "./github";

export interface Article {
    content: string;
    images: string[];
    publishDate: Date;
    viewCount: number;
}

/**
 * the project class that holds all the information about the project
 */
export class Project {
    id: number;
    name: string;
    description: string;
    url: string;
    topics: string[];
    article?: Article;

    constructor(
        id: number,
        name: string,
        description: string,
        url: string,
        topics: string[],
        article?: Article,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.topics = topics;
        this.article = article;
    }

    /**
     * creates a project from a repository
     * @param repo the repository to create the project from
     * @returns a project
     */
    static createFromRepository(repo: Repository): Project {
        return new Project(
            repo.id,
            repo.name,
            repo.description,
            repo.url,
            repo.topics,
        );
    }

    /**
     * updates the project with the given repository
     * @param repo the repository to update the project with
     */
    updateFromRepository(repo: Repository) {
        this.name = repo.name;
        this.description = repo.description;
        this.url = repo.url;
        this.topics = repo.topics;
    }

    /**
     * creates a new article
     * @param article the article content to create
     */
    addArticle(article: Article) {
        this.article = article;
    }

    /**
     * deletes the article
     */
    deleteArticle() {
        this.article = undefined;
    }

    /**
     * increments the view count
     */
    viewed() {
        this.article.viewCount++;
    }

    getMeta() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            url: this.url,
            topics: this.topics,
            publishDate: this.article.publishDate,
            hasArticle: this.article !== undefined,
            viewCount: this.article.viewCount,
        };
    }

    /**
     * creates a project from a json object
     * @param json the json object to create the project from
     * @returns a project
     */
    static fromJSON(json: any): Project {
        return new Project(
            json.id,
            json.name,
            json.description,
            json.url,
            json.topics,
            {
                content: json.article.content,
                images: json.article.images,
                publishDate: new Date(json.article["publish-date"]),
                viewCount: json.article["view-count"],
            },
        );
    }

    /**
     * the project represented as json
     * @returns the project as json
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            url: this.url,
            topics: this.topics,
            article: this.article,
        };
    }
}
