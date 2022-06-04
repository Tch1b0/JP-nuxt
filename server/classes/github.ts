import { Octokit } from "@octokit/rest";
import { EventEmitter } from "node:events";

/**
 * the global representation of a github-repository
 */
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

/**
 * the global representation of a github-profile
 */
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
    events = new EventEmitter();

    constructor(username: string) {
        this.username = username;
        this.api = new Octokit();

        // re-fetch the GitHub data every 10 minutes
        setInterval(async () => {
            await this.fetchRepos();
            await this.fetchProfile();
        }, 10 * 60 * 1000);
    }

    on(
        event: "profileFetch" | "reposFetch",
        listener: (...args: any[]) => any,
    ) {
        this.events.on(event, listener);
    }

    async getRepos(): Promise<Repository[]> {
        // check whether the repos were already fetched and
        // fetch them otherwise
        if (this._repos === undefined) {
            await this.fetchRepos();
        }
        return this._repos;
    }

    setRepos(value: object[]) {
        this._repos = value as Repository[];
    }

    async getProfile(): Promise<Profile> {
        // check whether the profile was already fetched and
        // fetch it otherwise
        if (this._profile === undefined) {
            await this.fetchProfile();
        }
        return this._profile;
    }

    async setProfile(value: object) {
        this._profile = value as Profile;
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
        this.events.emit("reposFetch", this._repos);
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
        this.events.emit("profileFetch", this._profile);
    }

    /**
     * get a certain repository by its id
     * @param id The id that is supposed to match the repos one
     * @returns The matching repository
     */
    async getRepo(id: number) {
        return (await this.getRepos()).find((repo) => repo.id === id);
    }

    /**
     * get the request rate of the github API
     * @returns The request rate object
     */
    async getRate() {
        return (await this.api.rateLimit.get()).data;
    }
}
