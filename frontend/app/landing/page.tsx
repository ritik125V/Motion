"use client";

import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

const tasks = [
  { id: 1, title: "Review design specs" },
  { id: 2, title: "Ship the feature" },
  { id: 3, title: "Write tests" },
];

export default function Landing() {
  const [status, setStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Prefetch routes for instant navigation
    router.prefetch("/home");
    router.prefetch("/auth/signup");

    const fetchStatus = async () => {
      try {
        // optimistic UI (feels instant)
        setStatus(true);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/status`,
          { withCredentials: true }
        );

        setStatus(res.data.status);
      } catch (err) {
        console.error("Status fetch failed:", err);
        setStatus(false);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-[#ededed] font-sans">

      <nav className="flex justify-between items-center px-12 py-6 border-b border-[#1a1a1a]">
        <span className="text-sm tracking-widest font-medium">motion</span>

        <div className="min-w-[110px] flex justify-center">
          <AnimatePresence mode="wait">
            <motion.button
              key={
                loading
                  ? "loading"
                  : error
                  ? "error"
                  : status
                  ? "add"
                  : "start"
              }
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (error) return;
                router.push(status ? "/home" : "/auth/signup");
              }}
              className="border border-white px-4 py-1 text-xs hover:bg-white hover:text-black transition"
            >
              get started
            </motion.button>
          </AnimatePresence>
        </div>
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

        <AnimatePresence mode="wait">
          <motion.button
            key={status ? "add-task" : "get-started"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="border p-2 active:bg-gray-800"
            onClick={() => {
              router.push(status ? "/home" : "/auth/signup");
            }}
          >
            {status ? "Add a task" : "Get started"}
          </motion.button>
        </AnimatePresence>
      </section>


      <section className="max-w-xl mx-auto px-6 pb-24">
        <div className="bg-[#111] border border-[#1f1f1f] rounded-md p-6">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-sm font-medium">My tasks</p>
              <p className="text-xs text-gray-500">{tasks.length} tasks</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-lg"
            >
              +
            </motion.button>
          </div>


          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-[#1a1a1a] rounded w-2/3" />
              <div className="h-4 bg-[#1a1a1a] rounded w-1/2" />
              <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
            </div>
          ) : (
            tasks.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: t.id * 0.05 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 py-3 border-b border-[#1f1f1f] hover:bg-[#141414]"
              >
                <div className="w-4 h-4 rounded-full border border-gray-500" />
                <span className="text-sm text-gray-200">{t.title}</span>
              </motion.div>
            ))
          )}
        </div>

        <p className="text-[11px] text-gray-700 text-center mt-3">
          static preview
        </p>
      </section>

      {/* Footer */}
      <footer className="max-w-xl mx-auto px-6 mb-10 py-8 border-t border-[#1a1a1a] flex justify-center text-xs text-gray-600">
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-green-500 hover:text-green-300 transition-colors cursor-pointer"
          onClick={() => {
            window.open("https://github.com/ritik125V/Motion", "_blank");
          }}
        >
          view Github repo
          <ExternalLink size={12} className="inline-block ml-1" />
        </motion.span>
      </footer>
    </main>
  );
}