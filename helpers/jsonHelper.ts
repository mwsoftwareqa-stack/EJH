export function parseJson(body: string | undefined) {
    try {
        return body ? JSON.parse(body) : null;
    } catch {
        return body;
    }
}
