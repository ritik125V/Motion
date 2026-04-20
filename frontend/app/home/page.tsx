"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddTodoCard from "@/components/AddTodoCard";
import TodoCard from "@/components/TodoCard";
import { Search } from "lucide-react";
import Header from "@/components/Header";
interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/todo/getall`,
        { withCredentials: true }
      );
      setTodos(res.data.todos);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  const normalized = query.toLowerCase();

  const matched = todos.filter(
    (t) =>
      t.title.toLowerCase().includes(normalized) ||
      t.description?.toLowerCase().includes(normalized)
  );

  const others = todos.filter((t) => !matched.includes(t));

  return (
    <div className="min-h-screen bg-[#191919]">
        <Header option="go to main" href="/" />
       
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-10 flex justify-between items-center gap-3">
          <div>
            <h1 className="text-[22px] font-medium text-[#EDEDED] tracking-tight">
              My tasks
            </h1>
            {!loading && (
              <p className="text-[13px] text-[#555] mt-1">
                {pending.length === 0
                  ? "All caught up"
                  : `${pending.length} remaining`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[#202020] px-3 py-2 rounded-lg border border-[#2F2F2F]">
            <Search size={16} className="text-[#555]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="bg-transparent outline-none text-sm text-[#EDEDED] placeholder:text-[#555] w-32"
            />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col gap-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 rounded-lg bg-[#202020] animate-pulse mt-5"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1E1E1E] border border-[#2F2F2F]">
            <span className="text-[13px] text-[#A3A3A3]">
              Failed to load tasks.
            </span>
            <button
              onClick={fetchTodos}
              className="text-[13px] text-[#EDEDED] underline underline-offset-2 hover:text-white transition-colors duration-150"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && todos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-[14px] text-[#3A3A3A]">No tasks yet</p>
            <p className="text-[12px] text-[#2F2F2F]">
              Press + to add your first one
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {query && matched.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] text-[#555] px-3 mb-1 uppercase tracking-wide">
                  Results
                </p>
                <div className="flex flex-col gap-0.5">
                  {matched.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      onUpdate={fetchTodos}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              {(query ? others : pending).map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onUpdate={fetchTodos}
                />
              ))}
            </div>

            {!query && completed.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] font-medium text-[#555] uppercase tracking-[0.06em] px-3 mb-1">
                  Completed
                </p>
                <div className="flex flex-col gap-0.5">
                  {completed.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      onUpdate={fetchTodos}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddTodoCard onAdd={fetchTodos} />
    </div>
  );
}