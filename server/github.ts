import { Octokit } from "@octokit/rest";

export default class GitHub {
    username: string;
    _repos: any[];
    _profile: any;
    api: Octokit;

    constructor(username: string) {
        this.username = username;
        this.api = new Octokit();
    }

    async getRepos(): Promise<any[]> {
        if (this._repos === undefined) {
            await this.fetchRepos();
        }
        return this._repos;
    }

    setRepos(value: any[]) {
        this._repos = value;
    }

    async getProfile(): Promise<any> {
        if (this._profile === undefined) {
            await this.fetchProfile();
        }
        return this._profile;
    }

    async setProfile(value: any) {
        this._profile = value;
    }

    async fetchRepos() {
        console.log("Fetching Repos");
        this.setRepos(
            (
                await this.api.rest.repos.listForUser({
                    username: this.username,
                    per_page: 100,
                })
            ).data,
        );
    }

    async fetchProfile() {
        console.log("Fetching Profile");
        this.setProfile(
            (
                await this.api.rest.users.getByUsername({
                    username: this.username,
                })
            ).data,
        );
    }

    /**
     * Get a certain repository by its id
     * @param id The id that is supposed to match the repos one
     * @returns The matching repository
     */
    async getRepo(id: number) {
        return (await this.getRepos()).filter((repo) => repo.id === id);
    }

    /**
     * Get the request rate of the github API
     * @returns The request rate object
     */
    async getRate() {
        return (await this.api.rateLimit.get()).data;
    }
}
