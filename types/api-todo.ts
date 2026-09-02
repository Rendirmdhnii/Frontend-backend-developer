export interface ApiTodo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
    isDeleted?: boolean;
    deletedOn?: string;
}

export interface TodosApiResponse {
    todos: ApiTodo[];
    total: number;
    skip: number;
    limit: number;
}

export interface TaskItem {
    id: number;
    title: string;
    completed: boolean;
    userId?: number;
    createdAt?: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
    status: number;
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
}
