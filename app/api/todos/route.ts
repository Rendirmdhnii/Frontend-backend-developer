import { NextRequest, NextResponse } from "next/server";
import { getTasks, mapApiTodoToTaskItem } from "@/lib/tasks";
import { todoService } from "@/services/todoService";
import { ApiError } from "@/services/api";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limitParam = searchParams.get("limit");
        const skipParam = searchParams.get("skip");

        const limit = limitParam ? parseInt(limitParam, 10) : 10;
        const skip = skipParam ? parseInt(skipParam, 10) : 0;

        const result = await getTasks(limit, skip);

        return NextResponse.json(
            {
                data: result.tasks,
                total: result.total,
                skip: result.skip,
                limit: result.limit,
            },
            { status: 200 }
        );
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const todoTitle = body.todo || body.title;

        if (!todoTitle || typeof todoTitle !== "string" || !todoTitle.trim()) {
            return NextResponse.json(
                { error: "Field 'todo' or 'title' is required and must not be empty" },
                { status: 400 }
            );
        }

        const completed = Boolean(body.completed);
        const userId = body.userId ? Number(body.userId) : 5;

        const apiTodo = await todoService.addTodoApi(todoTitle.trim(), completed, userId);
        const task = mapApiTodoToTaskItem(apiTodo);

        return NextResponse.json({ data: task }, { status: 201 });
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status });
    }
}
