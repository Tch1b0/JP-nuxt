import { Repository } from "./github";
import { Project } from "./project";
import fs from "node:fs";

/**
 * the project-collection class that holds all the information about the projects
 */
export default class ProjectCollection {
    projects: Project[];
    loadable: boolean;
    saveable: boolean;

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
    }

    /**
     * saves the project collection to the file system
     */
    save() {
        if (!this.saveable) return;
        if (!fs.existsSync("./data")) fs.mkdirSync("./data");

        fs.writeFileSync(
            "./data/projects.json",
            JSON.stringify(this.projects.map((project) => project.toJSON())),
        );
    }

    /**
     * loads the project collection from the file system
     */
    load() {
        if (!this.loadable) return;
        if (!fs.existsSync("./data")) return;

        const data = fs.readFileSync("./data/projects.json", "utf8");
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
