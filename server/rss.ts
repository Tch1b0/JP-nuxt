import { IncomingMessage, ServerResponse } from "http";
import { github, postCollection } from "./api";
import jstoxml from "jstoxml";
const { toXML } = jstoxml;
import { basicMdToHtml } from "~~/utility";

const url = "johannespour.de";
const username = "Tch1b0";
const description = "Some snek dev";

async function createRssPosts(): Promise<object> {
    const rssPosts = [];
    const repos = await github.getRepos();
    for (const post of postCollection.posts) {
        const repo = repos.find((r) => r.id === post.id);
        rssPosts.push({
            item: {
                title: repo.name,
                link: `https://${url}/project/${repo.id}`,
                description: repo.description,
                "content:encoded": basicMdToHtml(post.article),
                pubDate: post.pubDate,
                author: username,
            },
        });
    }

    return rssPosts;
}

export default async (_: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "text/xml");
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
                    { description },
                    { managingEditor: `(${username})` },
                    await createRssPosts(),
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
