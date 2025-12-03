export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout = 60000
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}