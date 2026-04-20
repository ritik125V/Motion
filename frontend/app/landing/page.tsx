"use client";

import axios from "axios";
import { button } from "framer-motion/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

const tasks = [
  { id: 1, title: "Review design specs" },
  { id: 2, title: "Ship the feature" },
  { id: 3, title: "Write tests" },
];

export default function Landing() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/status`,
          { withCredentials: true },
        );

        setStatus(res.data.status);
      } catch (err) {
        console.error("Status fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#ededed] font-sans">
      {/* Nav */}
      <nav className="flex justify-between items-center px-12 py-6 border-b border-[#1a1a1a]">
        <span className="text-sm tracking-widest font-medium">motion</span>

        <button className="border border-white px-4 py-1 text-xs hover:bg-white hover:text-black transition">
          {loading ? "..." : error ? "Retry" : "Get started"}
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-xl mx-auto px-6 py-24 space-y-6">
        <span className="text-[11px] border border-[#2a2a2a] px-3 py-1 rounded-full text-gray-500">
          beta
        </span>

        <h1 className="text-4xl md:text-6xl font-light leading-tight">
          Tasks, nothing else.
        </h1>

        <p className="text-sm text-gray-400 max-w-md leading-relaxed">
          Motion is a minimal todo app built for focus. Add a task, do it, move
          on.
        </p>

        {status ? (
          <button
            className="border p-2 active:bg-gray-800"
            onClick={() => {
              router.push("/home");
            }}
          >
            add a task
          </button>
        ) : (
          <button
            className="border p-2"
            onClick={() => {
              router.push("/auth/signup");
            }}
          >
            Get started
          </button>
        )}
      </section>

      {/* Demo */}
      <section className="max-w-xl mx-auto px-6 pb-24">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-md p-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-sm font-medium">My tasks</p>
              <p className="text-xs text-gray-500">{tasks.length} tasks</p>
            </div>

            <button className="w-7 h-7 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-lg">
              +
            </button>
          </div>

          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 py-3 border-b border-[#1f1f1f] hover:bg-[#141414]"
            >
              <div className="w-4 h-4 rounded-full border border-gray-500" />

              <span className="text-sm text-gray-200">{t.title}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-gray-700 text-center mt-3">
          static preview
        </p>
      </section>

      {/* Footer */}
      <footer className="max-w-xl mx-auto px-6 mb-10 py-8 border-t border-[#1a1a1a] flex justify-center text-xs text-gray-600">
        <span
          className="text-green-500 hover:text-green-300 hover:scale-105 duration-150 transition-colors cursor-pointer"
          onClick={() => {
            window.open("https://github.com/ritik125V/Motion    ", "_blank");
          }}
        >
          view Github repo
          <ExternalLink size={12} className="inline-block ml-1" />
        </span>
      </footer>
    </main>
  );
}
