import { expect } from "chai";
import { Project, projectSort } from "~~/utility";

describe("Test Frontend", () => {
    it("Test project sorting", () => {
        const projects = [
            {
                name: "repo",
                id: 1,
                description: "description",
                url: "https://example.com/repo.git",
                topics: ["topic0", "topic1"],
                language: "TypeScript",
                article: {
                    publishDate: new Date(),
                    viewCount: 3,
                },
            } as Project,
            {
                name: "repo",
                id: 2,
                description: "description",
                url: "https://example.com/repo.git",
                topics: ["topic0", "topic1"],
                language: "TypeScript",
                article: {
                    publishDate: new Date(),
                    viewCount: 50,
                },
            } as Project,
            {
                name: "repo",
                id: 3,
                description: "description",
                url: "https://example.com/repo.git",
                topics: ["topic0", "topic1"],
                language: "TypeScript",
                article: {
                    publishDate: new Date(),
                    viewCount: 75,
                },
            } as Project,
            {
                name: "repo",
                id: 4,
                description: "description",
                url: "https://example.com/repo.git",
                topics: ["topic0", "topic1"],
                language: "TypeScript",
            } as Project,
        ];

        const sorted = projects.sort((a, b) => projectSort(a, b)).reverse();
        expect(sorted[0].id).to.equal(3);
        expect(sorted[1].id).to.equal(2);
        expect(sorted[2].id).to.equal(1);
        expect(sorted[3].id).to.equal(4);
    });
});
