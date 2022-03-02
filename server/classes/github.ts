import { Octokit } from "@octokit/rest";

export interface Repository {
    name: string;
    id: number;
    description: string;
    url: string;
    html_url: string;
    topics: string[];
    language: string;
    fork: boolean;
}

export interface Profile {
    // The Username
    login: string;
    // Real name
    name: string;
    id: number;
    url: string;
    html_url: string;
    avatar_url: string;
    location: string;
    followers: number;
    following: number;
    bio: string;
}

export default class GitHub {
    username: string;
    _repos: Repository[];
    _profile: Profile;
    api: Octokit;

    constructor(username: string) {
        this.username = username;
        this.api = new Octokit();

        // re-fetch the GitHub data every 10 minutes
        setInterval(async () => {
            await this.fetchRepos();
            await this.fetchProfile();
        }, 10 * 60 * 1000);
    }

    async getRepos(): Promise<Repository[]> {
        if (this._repos === undefined) {
            await this.fetchRepos();
        }
        return this._repos;
    }

    setRepos(value: any[]) {
        this._repos = value;
    }

    async getProfile(): Promise<Profile> {
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
                    sort: "updated",
                })
            ).data.filter((repo) => !repo.fork),
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
        return (await this.getRepos()).find((repo) => repo.id === id);
    }

    /**
     * Get the request rate of the github API
     * @returns The request rate object
     */
    async getRate() {
        return (await this.api.rateLimit.get()).data;
    }
}
