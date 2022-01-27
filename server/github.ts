import { Octokit } from "@octokit/rest";

export async function getPublicRepos(username: string) {
    const api = new Octokit();
    const repos = await api.rest.repos.listForUser({ username, per_page: 100 });

    return repos.data;
}

export async function getProfile(username: string) {
    const api = new Octokit();
    const profile = await api.rest.users.getByUsername({ username });

    return profile.data;
}
