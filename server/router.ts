import type { H3Event } from "h3";
import type { IncomingMessage, ServerResponse } from "http";

type RequestCallback = (event: H3Event) => Promise<void> | void;

export type ErrorCode = 500 | 404;

export function sendJson(res: ServerResponse, obj: object) {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(obj));
}

export function sendUnauthorized(res: ServerResponse): void {
    res.statusCode = 401;
    res.end();
}

export function sendError(
    res: ServerResponse,
    message: string,
    errorCode: ErrorCode,
): void {
    res.statusCode = errorCode;
    res.end(message);
}

/**
 * get the `id` pramater from the route
 * @param req the request from which the id should be taken from
 */
export function idFromReq(req: IncomingMessage): number {
    return Number(req.url.split("/")[2]);
}

/**
 * the router is used for passing a request to the right callback
 */
export default class Router {
    handlers: Map<string, Map<string, RequestCallback>> = new Map([
        ["GET", new Map([])],
        ["POST", new Map([])],
        ["PUT", new Map([])],
        ["PATCH", new Map([])],
        ["DELETE", new Map([])],
    ]);

    async handle(e: H3Event) {
        const url = "/" + e.req.url.split("/")[1];

        if (this.handlers.get(e.req.method).has(url)) {
            await this.handlers.get(e.req.method).get(url)(e);
        } else {
            e.res.statusCode = 404;
            e.res.end();
        }
    }

    private addHandler(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        route: string,
        callback: RequestCallback,
    ) {
        this.handlers.get(method).set(route, callback);
    }

    get(route: string, callback: RequestCallback) {
        this.addHandler("GET", route, callback);
    }

    post(route: string, callback: RequestCallback) {
        this.addHandler("POST", route, callback);
    }

    put(route: string, callback: RequestCallback) {
        this.addHandler("PUT", route, callback);
    }

    patch(route: string, callback: RequestCallback) {
        this.addHandler("PATCH", route, callback);
    }

    delete(route: string, callback: RequestCallback) {
        this.addHandler("DELETE", route, callback);
    }
}
