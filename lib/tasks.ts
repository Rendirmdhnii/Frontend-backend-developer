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

export async function getTasks(
    limit = 10,
    skip = 0
): Promise<{ tasks: TaskItem[]; total: number; skip: number; limit: number }> {
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
