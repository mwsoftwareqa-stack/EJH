export function createQueryString(queryParams: Record<string, any>): string {
    return new URLSearchParams(
        Object.entries(queryParams)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
    ).toString();
}