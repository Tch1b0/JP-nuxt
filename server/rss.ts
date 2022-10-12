import { IncomingMessage, ServerResponse } from "http";
import { github, projectCollection } from "./api";
import jstoxml from "jstoxml";
const { toXML } = jstoxml;
import { basicMdToHtml, cacheValue } from "~~/utility";
import { Profile } from "./classes/github";

const url = "johannespour.de";

/**
 * create xml-parsable posts
 * @param profile the profile of the author
 * @returns the posts in xml-parsable objects
 */
async function createRssPosts(profile: Profile): Promise<object> {
    const rssPosts = [];
    for (const project of projectCollection.projects) {
        if (project.article === undefined) continue;
        rssPosts.push({
            item: {
                title: project.name,
                link: `https://${url}/projects/${project.id}`,
                description: project.description,
                "content:encoded": basicMdToHtml(project.article.content),
                pubDate: project.article.publishDate,
                author: profile.login,
            },
        });
    }

    return rssPosts;
}

async function createXmlResponse(): Promise<string> {
    const profile = await github.getProfile();

    return toXML(
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
}

// respond with the rss feed
export default async (_: IncomingMessage, res: ServerResponse) => {
    res.setHeader("Content-Type", "text/xml");

    const xmlResponse = await cacheValue(
        "rss-feed",
        async () => await createXmlResponse(),
        { minutes: 5 },
    );

    res.end(xmlResponse);
};
