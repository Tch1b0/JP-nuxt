import { IncomingMessage, ServerResponse } from "http";
import { github, postCollection } from "./api";
import jstoxml from "jstoxml";
const { toXML } = jstoxml;
import { basicMdToHtml } from "~~/utility";
import { Profile } from "./classes/github";

const url = "johannespour.de";

/**
 * create xml-parsable posts
 * @param profile the profile of the author
 * @returns the posts in xml-parsable objects
 */
async function createRssPosts(profile: Profile): Promise<object> {
    const rssPosts = [];
    const repos = await github.getRepos();
    for (const post of postCollection.posts) {
        const repo = repos.find((r) => r.id === post.id);
        rssPosts.push({
            item: {
                title: repo.name,
                link: `https://${url}/projects/${repo.id}`,
                description: repo.description,
                "content:encoded": basicMdToHtml(post.article),
                pubDate: post.pubDate,
                author: profile.login,
            },
        });
    }

    return rssPosts;
}

export default async (_: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "text/xml");
    const profile = await github.getProfile();
    const xml = toXML(
        {
            _name: "rss",
            _attrs: {
                version: "2.0",
                "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
            },
            _content: {
                channel: [
                    { title: url },
                    { link: `https://${url}` },
                    { description: profile.bio || "German Developer" },
                    { managingEditor: `(${profile.login})` },
                    await createRssPosts(profile),
                ],
            },
        },
        {
            indent: "  ",
            header: true,
        },
    );

    res.end(xml);
};
