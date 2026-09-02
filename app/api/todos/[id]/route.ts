import { NextRequest, NextResponse } from "next/server";
import { getTaskById, mapApiTodoToTaskItem } from "@/lib/tasks";
import { todoService } from "@/services/todoService";
import { ApiError } from "@/services/api";

type RouteParams = {
    params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const task = await getTaskById(id);
        return NextResponse.json({ data: task }, { status: 200 });
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status });
    }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (typeof body.completed !== "boolean") {
            return NextResponse.json(
                { error: "Field 'completed' must be a boolean" },
                { status: 400 }
            );
        }

        const updatedApiTodo = await todoService.updateTodoApi(id, body.completed);
        const task = mapApiTodoToTaskItem(updatedApiTodo);

        return NextResponse.json({ data: task }, { status: 200 });
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        await todoService.deleteTodoApi(id);
        return NextResponse.json({ message: `Task ${id} deleted successfully` }, { status: 200 });
    } catch (error) {
        const status = error instanceof ApiError ? error.status : 500;
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status });
    }
}
