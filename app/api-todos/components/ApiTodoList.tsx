"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TaskItem } from "@/types/api-todo";
import { getTaskStats } from "@/lib/tasks";

interface ApiTodoListProps {
    initialTasks?: TaskItem[];
}

export default function ApiTodoList({ initialTasks = [] }: ApiTodoListProps) {
    const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
    const [total, setTotal] = useState(initialTasks.length);
    const [limit] = useState(5);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(initialTasks.length === 0);
    const [error, setError] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const stats = React.useMemo(() => getTaskStats(tasks), [tasks]);
    const isFirstMount = React.useRef(true);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/todos?limit=${limit}&skip=${skip}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Gagal mengambil data dari API");
            }
            setTasks(data.data || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    }, [limit, skip]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            if (initialTasks.length > 0) {
                return;
            }
        }
        fetchTasks();
    }, [fetchTasks, initialTasks.length]);

    // Handler untuk Add Todo via API
    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newTitle.trim();
        if (!trimmed || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todo: trimmed, completed: false }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal menambahkan tugas");
            }

            // Sisipkan task baru ke paling atas list
            setTasks((prev) => [data.data, ...prev]);
            setTotal((prev) => prev + 1);
            setNewTitle("");
        } catch (err) {
            alert(err instanceof Error ? err.message : "Gagal menambahkan task");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler dengan OPTIMISTIC UPDATE saat toggle checkbox
    const handleToggleOptimistic = async (id: number, currentCompleted: boolean) => {
        const nextCompleted = !currentCompleted;

        // 1. Snapshot state sebelumnya untuk rollback jika API gagal
        const previousTasks = [...tasks];

        // 2. Optimistic Update: langsung perbarui UI lokal tanpa menunggu server
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
        );

        try {
            // 3. Kirim request ke backend BFF
            const res = await fetch(`/api/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: nextCompleted }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal memperbarui status di server");
            }
        } catch (err) {
            // 4. Jika gagal, kembalikan ke state semula (Rollback)
            setTasks(previousTasks);
            alert(`Rollback: ${err instanceof Error ? err.message : "Gagal memperbarui task"}`);
        }
    };

    // Handler Delete
    const handleDeleteTask = async (id: number) => {
        const previousTasks = [...tasks];
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));

        try {
            const res = await fetch(`/api/todos/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal menghapus task");
            }
        } catch (err) {
            setTasks(previousTasks);
            setTotal((prev) => prev + 1);
            alert(`Rollback: ${err instanceof Error ? err.message : "Gagal menghapus task"}`);
        }
    };

    const totalPages = Math.ceil(total / limit) || 1;
    const currentPage = Math.floor(skip / limit) + 1;

    return (
        <div>
            {/* Statistics Banner */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">Total Halaman</p>
                    <p className="text-xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600 font-medium">Selesai</p>
                    <p className="text-xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600 font-medium">Belum Selesai</p>
                    <p className="text-xl font-bold text-amber-900">{stats.pending}</p>
                </div>
            </div>

            {/* Form Tambah Task */}
            <div className="mb-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                <form onSubmit={handleAddTask} className="flex gap-2">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Tambah tugas via API (DummyJSON)..."
                        className="flex-1 text-gray-800 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={!newTitle.trim() || isSubmitting}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                        {isSubmitting ? "Menyimpan..." : "Tambah API"}
                    </button>
                </form>
            </div>

            {/* State Loading & Error */}
            {loading ? (
                <div className="text-center p-8 text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mb-2"></div>
                    <p className="text-sm">Memuat data dari API...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 mb-4">
                    <p className="font-semibold">Terjadi Kesalahan</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchTasks}
                        className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center p-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
                    <p>Tidak ada data tugas pada halaman ini.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`p-4 rounded-md border flex items-center justify-between gap-3 transition-colors ${task.completed
                                    ? "bg-green-50 border-green-200"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggleOptimistic(task.id, task.completed)}
                                    className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                                />
                                <span
                                    className={`${task.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800 font-medium"
                                        }`}
                                >
                                    {task.title}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline shrink-0"
                            >
                                Hapus
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Controls Paginasi */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    Halaman <span className="font-semibold">{currentPage}</span> dari{" "}
                    <span className="font-semibold">{totalPages}</span> (Total {total} tugas)
                </p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setSkip((prev) => Math.max(0, prev - limit))}
                        disabled={skip === 0 || loading}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Sebelumnya
                    </button>
                    <button
                        type="button"
                        onClick={() => setSkip((prev) => prev + limit)}
                        disabled={skip + limit >= total || loading}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 border border-gray-300 rounded text-xs font-medium hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Selanjutnya
                    </button>
                </div>
            </div>
        </div>
    );
}
