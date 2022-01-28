import { Octokit } from "@octokit/rest";

let repos: any;

export async function getPublicRepos(username: string) {
    if (repos !== undefined) {
        console.log("NOT Fetching Data");
        return repos.data;
    }

    const api = new Octokit();
    repos = await api.rest.repos.listForUser({ username, per_page: 100 });
    console.log("Fetching Data...");

    return repos.data;
}

export async function getProfile(username: string) {
    const api = new Octokit();
    const profile = await api.rest.users.getByUsername({ username });

    return profile.data;
}

export async function getRate() {
    return new Octokit().rateLimit.get();
}
