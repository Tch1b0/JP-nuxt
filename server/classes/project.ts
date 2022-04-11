import { Repository } from "./github";

export interface Article {
    content?: string;
    images?: string[];
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
    language: string;
    topics: string[];
    article?: Article;

    constructor(
        id: number,
        name: string,
        description: string,
        url: string,
        language: string,
        topics: string[],
        article?: Article,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.language = language;
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
            repo.html_url,
            repo.language,
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
        this.url = repo.html_url;
        this.language = repo.language;
        this.topics = repo.topics;
    }

    /**
     * creates a new article
     * @param content the article content to create
     * @param images the article images to create
     */
    addArticle(content: string, images: string[]) {
        this.article = {
            content: content,
            images: images,
            publishDate: new Date(),
            viewCount: 0,
        };
    }

    /**
     * updates the article content and images
     * @param content the new content
     * @param images the new images
     */
    updateArticle(content: string, images: string[]) {
        this.article.content = content;
        this.article.images = images;
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
        const articleMeta =
            this.article === undefined
                ? undefined
                : {
                      "publish-date": this.article.publishDate,
                      "view-count": this.article.viewCount,
                  };
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            url: this.url,
            topics: this.topics,
            language: this.language,
            article: articleMeta,
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
            json.language,
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
            language: this.language,
            topics: this.topics,
            article:
                this.article === undefined
                    ? undefined
                    : {
                          content: this.article.content,
                          images: this.article.images,
                          "publish-date": this.article.publishDate,
                          "view-count": this.article.viewCount,
                      },
        };
    }
}
