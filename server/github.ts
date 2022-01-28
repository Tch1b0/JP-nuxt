import { Octokit } from "@octokit/rest";

let repos: any;
let profile: any;

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
    if (profile !== undefined) {
        console.log("NOT Fetching Profile");
        return profile;
    }

    const api = new Octokit();
    const fetchedProfile = await api.rest.users.getByUsername({ username });
    profile = fetchedProfile.data;

    return fetchedProfile.data;
}

export async function getRate() {
    return await new Octokit().rateLimit.get();
}
