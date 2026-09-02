"use client";

import React from "react";
import TodoForm from "@/app/components/TodoForm";
import TodoList from "@/app/components/TodoList";
import { Todo } from "@/types/todo";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type TodoCachedAppProps = {
    initialTodos: Todo[];
};

export default function TodoCachedApp({ initialTodos }: TodoCachedAppProps) {
    const [todos, setTodos, resetCache] = useLocalStorage<Todo[]>(
        "TODO_LIST_CACHE",
        initialTodos
    );

    const handleAddTodo = (title: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            title,
            description: "",
            completed: false,
            createdAt: new Date().toISOString().split("T")[0],
        };
        setTodos((prev) => [newTodo, ...prev]);
    };

    const handleToggleTodo = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleDeleteTodo = (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const handleResetCache = () => {
        resetCache();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    Tersimpan di LocalStorage
                </span>
                <button
                    type="button"
                    onClick={handleResetCache}
                    className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                >
                    Reset Cache
                </button>
            </div>
            <TodoForm onAddTodo={handleAddTodo} />
            <TodoList
                todos={todos}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
            />
        </div>
    );
}
