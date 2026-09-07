import { todoService } from "@/services/todoService";
import { ApiTodo, TaskItem, TaskStats } from "@/types/api-todo";

export function mapApiTodoToTaskItem(apiTodo: ApiTodo): TaskItem {
    return {
        id: apiTodo.id,
        title: apiTodo.todo,
        completed: apiTodo.completed,
        userId: apiTodo.userId,
        createdAt: apiTodo.deletedOn || new Date().toISOString().split("T")[0],
    };
}

export interface GetTasksOptions {
    limit?: number;
    skip?: number;
}

export async function getTasks(
    options?: GetTasksOptions
): Promise<{ tasks: TaskItem[]; total: number; skip: number; limit: number }>;
export async function getTasks(
    limit?: number,
    skip?: number
): Promise<{ tasks: TaskItem[]; total: number; skip: number; limit: number }>;
export async function getTasks(
    limitOrOptions: number | GetTasksOptions = 10,
    skipParam = 0
): Promise<{ tasks: TaskItem[]; total: number; skip: number; limit: number }> {
    let limit = 10;
    let skip = 0;

    if (typeof limitOrOptions === "object" && limitOrOptions !== null) {
        limit = limitOrOptions.limit ?? 10;
        skip = limitOrOptions.skip ?? 0;
    } else if (typeof limitOrOptions === "number") {
        limit = limitOrOptions;
        skip = skipParam;
    }

    const data = await todoService.getTodosApi(limit, skip);
    const tasks = data.todos.map(mapApiTodoToTaskItem);

    return {
        tasks,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
    };
}

export async function getTaskById(id: number | string): Promise<TaskItem> {
    const apiTodo = await todoService.getTodoByIdApi(id);
    return mapApiTodoToTaskItem(apiTodo);
}

export function getTaskStats(todos: (TaskItem | ApiTodo)[]): TaskStats {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    return {
        total,
        completed,
        pending,
    };
}
