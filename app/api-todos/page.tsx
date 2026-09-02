import React from "react";
import ApiTodoList from "./components/ApiTodoList";

export default function ApiTodosPage() {
  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-6 border-b pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Tugas (API & BFF)</h1>
          <p className="text-xs text-gray-500 mt-1">
            Fetch Data, BFF Route Handlers & Optimistic Updates
          </p>
        </header>

        <ApiTodoList />
      </div>
    </main>
  );
}
