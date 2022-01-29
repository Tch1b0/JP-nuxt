export function splitUrl(url: string): { endpoint: string; params: string[] } {
    const splittedUrl = url.split("/").splice(1);
    const endpoint: string = "/" + splittedUrl[0];
    const params: string[] = splittedUrl.splice(1);

    return {
        endpoint,
        params,
    };
}

export function getIdFromParams(params: any[]): number {
    const [rawId] = params;
    return Number(rawId);
}
