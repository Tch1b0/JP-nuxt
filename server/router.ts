import type { IncomingMessage, ServerResponse } from "http";
import {} from "h3";

export function sendJson(res: ServerResponse, obj: any) {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(obj));
}

export default class Router {
    handlers: Map<
        string,
        Map<
            string,
            (req: IncomingMessage, res: ServerResponse) => Promise<void> | void
        >
    >;

    constructor() {
        this.handlers = new Map([
            ["GET", new Map([])],
            ["POST", new Map([])],
            ["PUT", new Map([])],
            ["PATCH", new Map([])],
            ["DELETE", new Map([])],
        ]);
    }

    async handle(req: IncomingMessage, res: ServerResponse) {
        const url = "/" + req.url.split("/")[1];

        if (this.handlers.get(req.method).has(url)) {
            await this.handlers.get(req.method).get(url)(req, res);
        } else {
            res.statusCode = 404;
            res.end();
        }
    }

    get(
        route: string,
        callback: (req: IncomingMessage, res: ServerResponse) => void,
    ) {
        this.handlers.get("GET").set(route, callback);
    }

    post(
        route: string,
        callback: (req: IncomingMessage, res: ServerResponse) => void,
    ) {
        this.handlers.get("POST").set(route, callback);
    }

    put(
        route: string,
        callback: (req: IncomingMessage, res: ServerResponse) => void,
    ) {
        this.handlers.get("PUT").set(route, callback);
    }

    patch(
        route: string,
        callback: (req: IncomingMessage, res: ServerResponse) => void,
    ) {
        this.handlers.get("PATCH").set(route, callback);
    }

    delete(
        route: string,
        callback: (req: IncomingMessage, res: ServerResponse) => void,
    ) {
        this.handlers.get("DELETE").set(route, callback);
    }
}
