const BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorData: { message?: string } | null = null;
            try {
                errorData = (await response.json()) as { message?: string };
            } catch {
                errorData = null;
            }
            throw new ApiError(
                errorData?.message || `Request failed with status ${response.status}`,
                response.status,
                errorData
            );
        }

        return (await response.json()) as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            error instanceof Error ? error.message : "Unknown network error",
            500
        );
    }
}
