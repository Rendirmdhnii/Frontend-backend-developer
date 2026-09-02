import React from "react";
import TodoCachedApp from "./components/TodoCachedApp";
import { getTodos } from "@/lib/todos";

export default async function CachedPage() {
  const todos = await getTodos();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-6 border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Tugas (Cached)</h1>
          <p className="text-xs text-gray-500 mt-1">Local Storage Caching dengan useSyncExternalStore</p>
        </header>

        <TodoCachedApp initialTodos={todos} />
      </div>
    </main>
  );
}
