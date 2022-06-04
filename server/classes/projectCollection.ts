import { Repository } from "./github";
import { Project } from "./project";
import fs from "node:fs";

type OldPost = {
    "project-id": number;
    article: string;
    images: string[];
    views: number;
    "pub-date": string;
};

/**
 * the project-collection class that holds all the information about the projects
 */
export default class ProjectCollection {
    saveDir = "./data";
    saveFile = `${this.saveDir}/projects.json`;
    projects: Project[];
    loadable: boolean;
    saveable: boolean;
    migrationRanOnce = false;

    constructor(
        projects?: Project[],
        loadable: boolean = undefined,
        saveable: boolean = undefined,
    ) {
        this.projects = projects ?? [];
        const isProduction = process.env.NODE_ENV === "production";
        this.loadable = loadable ?? isProduction;
        this.saveable = saveable ?? isProduction;

        if (this.loadable) this.load();
        if (this.projects.length > 0) this.migratePosts();
        if (this.saveable) this.save();
    }

    /**
     * updates the project with the given id with the given repository
     * @param repos the repository to update the project with
     */
    updateRepositories(repos: Repository[]) {
        for (const repo of repos) {
            const project = this.getProjectById(repo.id);
            if (project) {
                project.updateFromRepository(repo);
            } else {
                this.projects.push(Project.createFromRepository(repo));
            }
        }
        if (!this.migrationRanOnce) this.migratePosts();
        this.save();
    }

    /**
     * saves the project collection to the file system
     */
    save() {
        if (!this.saveable) return;
        if (!fs.existsSync(this.saveDir)) fs.mkdirSync(this.saveDir);

        fs.writeFileSync(
            this.saveFile,
            JSON.stringify(this.projects.map((project) => project.toJSON())),
        );
    }

    /**
     * loads the project collection from the file system
     */
    load() {
        if (!this.loadable) return;
        if (!fs.existsSync(this.saveFile)) return;

        const data = fs.readFileSync(this.saveFile, "utf8");
        if (!data) return;

        this.projects = JSON.parse(data).map((project: object) =>
            Project.fromJSON(project),
        );
    }

    /**
     * gets the project with the given id
     * @param id the id of the project to get
     * @returns the project with the given id or undefined if no project with the given id exists
     */
    getProjectById(id: number): Project | undefined {
        return this.projects.find((project) => project.id === id);
    }

    /**
     * checks if there are outdated posts to migrate, and migrates them
     */
    migratePosts() {
        this.migrationRanOnce = true;
        const postFile = `${this.saveDir}/posts.json`;
        if (!fs.existsSync(postFile)) return;

        const content = fs.readFileSync(postFile, "utf8");
        JSON.parse(content).forEach((post: OldPost) => {
            const project = this.getProjectById(post["project-id"]);
            if (!project || project.article !== undefined) return;

            project.article = {
                content: post.article,
                images: post.images,
                viewCount: post.views,
                publishDate: new Date(post["pub-date"]),
            };
        });
    }

    /**
     * the project collection as json
     * @returns an array of the projects as json
     */
    toJSON() {
        return this.projects;
    }

    /**
     * creates the project collection from the given json
     * @param json the json to create the project collection from
     * @returns a project collection
     */
    static fromJSON(json: object[]): ProjectCollection {
        const collection = new ProjectCollection();
        collection.projects = json.map((project) => Project.fromJSON(project));
        return collection;
    }
}
