"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

type Status = "success" | "error" | "loading" | "";

interface AddTodoCardProps {
  onAdd?: () => void;
}

export default function AddTodoCard({ onAdd }: AddTodoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleAddTodo();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, title, description]);

  function handleClose() {
    setIsOpen(false);
    setStatus("");
  }

  async function handleAddTodo() {
    if (!title.trim()) {
      titleRef.current?.focus();
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/todo/create`,
        { title, description },
        { withCredentials: true }
      );
      console.log(res.data);
      setStatus("success");
      onAdd?.();
      setTitle("");
      setDescription("");
      setTimeout(handleClose, 800);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-15 right-15 z-50
          w-11 h-11
          bg-[#EDEDED] hover:bg-white
          rounded-lg
          flex items-center justify-center
          transition-all duration-150 ease-out
          active:scale-95
          shadow-none
          animate-pulse
        "
        aria-label="Add new todo"
      >
        <Plus size={15} strokeWidth={2.2} className="text-[#191919]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={handleClose}
            >
              <div
                className="
                  w-full max-w-[360px]
                  bg-[#202020]
                  border border-[#2F2F2F]
                  rounded-[14px]
                  p-[22px]
                  relative
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-[18px]">
                  <span className="text-[14px] font-medium text-[#EDEDED] tracking-[0.01em]">
                    New todo
                  </span>
                  <button
                    onClick={handleClose}
                    className="
                      w-[26px] h-[26px]
                      flex items-center justify-center
                      rounded-[6px]
                      hover:bg-[#2A2A2A]
                      transition-colors duration-150 ease-out
                    "
                    aria-label="Close"
                  >
                    <X size={14} strokeWidth={2} className="text-[#A3A3A3]" />
                  </button>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-[10px]">
                  <input
                    ref={titleRef}
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="
                      w-full
                      bg-[#191919]
                      border border-[#2F2F2F]
                      rounded-[8px]
                      px-3 py-[9px]
                      text-[13px] text-[#EDEDED]
                      placeholder:text-[#555]
                      outline-none
                      focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/15
                      transition-all duration-150 ease-out
                    "
                  />
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="
                      w-full
                      bg-[#191919]
                      border border-[#2F2F2F]
                      rounded-[8px]
                      px-3 py-[9px]
                      text-[13px] text-[#EDEDED]
                      placeholder:text-[#555]
                      outline-none
                      focus:border-blue-500
                      focus:ring-2 focus:ring-blue-500/15
                      transition-all duration-150 ease-out
                      resize-none
                      leading-[1.5]
                    "
                  />
                </div>

                {/* Status messages */}
                <div className="mt-2 h-4">
                  {status === "loading" && (
                    <p className="text-[12px] text-[#A3A3A3]">Adding...</p>
                  )}
                  {status === "error" && (
                    <p className="text-[12px] text-red-400">
                      {!title.trim() ? "Title is required" : "Something went wrong"}
                    </p>
                  )}
                  {status === "success" && (
                    <p className="text-[12px] text-green-400">Todo added</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleAddTodo}
                  disabled={status === "loading"}
                  className="
                    mt-4 w-full
                    bg-[#EDEDED] hover:bg-white
                    text-[#191919]
                    rounded-[8px]
                    py-[9px] px-4
                    text-[13px] font-medium
                    transition-all duration-150 ease-out
                    active:scale-[0.98]
                    disabled:opacity-45 disabled:cursor-not-allowed
                  "
                >
                  Add todo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}