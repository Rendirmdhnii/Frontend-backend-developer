"use client";

import React from "react";
import Link from "next/link";
import { Todo } from "@/types/todo";

type TodoItemProps = {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li
            className={`p-4 rounded-md border flex items-center justify-between gap-3 transition-colors ${todo.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
        >
            <div className="flex items-center gap-3 flex-1">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo.id)}
                    className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                />
                <span className={`${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {todo.title}
                </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Link
                    href={`/task/${todo.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                    Detail
                </Link>
                <button
                    type="button"
                    onClick={() => onDelete(todo.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline"
                >
                    Hapus
                </button>
            </div>
        </li>
    );
}