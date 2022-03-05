import { expect } from "chai";
import { Post, projectSort } from "~~/utility";
import { Repository } from "~~/server/classes/github";

describe("Test Frontend", () => {
    it("Test project sorting", () => {
        const repos = [
            {
                name: "repo",
                id: 1,
                description: "description",
                url: "https://example.com/repo.git",
                html_url: "https://example.com/repo",
                topics: ["topic0", "topic1"],
                language: "english",
                fork: false,
            } as Repository,
            {
                name: "repo",
                id: 2,
                description: "description",
                url: "https://example.com/repo.git",
                html_url: "https://example.com/repo",
                topics: ["topic0", "topic1"],
                language: "english",
                fork: false,
            } as Repository,
            {
                name: "repo",
                id: 3,
                description: "description",
                url: "https://example.com/repo.git",
                html_url: "https://example.com/repo",
                topics: ["topic0", "topic1"],
                language: "english",
                fork: false,
            } as Repository,
            {
                name: "repo",
                id: 4,
                description: "description",
                url: "https://example.com/repo.git",
                html_url: "https://example.com/repo",
                topics: ["topic0", "topic1"],
                language: "english",
                fork: false,
            } as Repository,
        ];

        const posts = [
            {
                "project-id": 1,
                article: "article",
                images: [],
                views: 3,
            } as Post,
            {
                "project-id": 2,
                article: "article",
                images: [],
                views: 50,
            } as Post,
            {
                "project-id": 3,
                article: "article",
                images: [],
                views: 75,
            } as Post,
        ];

        const sorted = repos.sort((a, b) => projectSort(a, b, posts)).reverse();
        expect(sorted[0].id).to.equal(3);
        expect(sorted[1].id).to.equal(2);
        expect(sorted[2].id).to.equal(1);
        expect(sorted[3].id).to.equal(4);
    });
});
