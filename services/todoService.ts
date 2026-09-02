import { apiClient } from "./api";
import { ApiTodo, TodosApiResponse } from "@/types/api-todo";

export const todoService = {
    async getTodosApi(limit = 10, skip = 0): Promise<TodosApiResponse> {
        return apiClient<TodosApiResponse>(`/todos?limit=${limit}&skip=${skip}`);
    },

    async getTodoByIdApi(id: number | string): Promise<ApiTodo> {
        return apiClient<ApiTodo>(`/todos/${id}`);
    },

    async addTodoApi(
        todo: string,
        completed = false,
        userId = 5
    ): Promise<ApiTodo> {
        return apiClient<ApiTodo>("/todos/add", {
            method: "POST",
            body: JSON.stringify({
                todo,
                completed,
                userId,
            }),
        });
    },

    async updateTodoApi(
        id: number | string,
        completed: boolean
    ): Promise<ApiTodo> {
        return apiClient<ApiTodo>(`/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                completed,
            }),
        });
    },

    async deleteTodoApi(id: number | string): Promise<ApiTodo> {
        return apiClient<ApiTodo>(`/todos/${id}`, {
            method: "DELETE",
        });
    },
};
