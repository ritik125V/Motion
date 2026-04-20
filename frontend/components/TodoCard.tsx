"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, Trash2, X ,Circle,CircleCheck,Loader, Loader2   } from "lucide-react";
import { p, param } from "framer-motion/client";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

function TodoCard({ todo, onUpdate }: { todo: Todo; onUpdate?: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus , setUpdatingstatus] = useState(false)

  async function toggleCompletion() {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/todo/updateStatus`,
        {},{
            params:{
                id: todo._id,
                status: !todo.completed
            },
            withCredentials: true
        }
        
      );
      onUpdate?.();
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  }

  async function deleteTodo() {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/todo/delete`,
            {
            params:{
                id: todo._id
            },
            withCredentials: true
        }
      );
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  async function saveEdit() {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/todo/edit`,
        {  title: editTitle, description: editDesc },
        {
            params:{
                id: todo._id
            },
            withCredentials: true }
      );
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error editing todo:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* View mode */}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="group flex  gap-3 px-3 py-[10px] rounded-[8px] hover:bg-[#242424] transition-colors duration-150"
          >
            {/* Checkbox */}
            <button
            className=" py-0.5 flex flex-col" 
              onClick={toggleCompletion}
            >
              {
                updatingStatus ? (
                    <Loader size={16} className="text-[#EDEDED] animate-spin" />
                ) : (
                    todo.completed ? (
                        <CircleCheck size={16} className="text-green-500" />
                    ) : (
                        <Circle size={16} className="text-[#555]" />
                    )
                )
              }
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 ">
              <p
                className={`
                  text-[14px] leading-[1.4] transition-colors duration-150
                  ${todo.completed
                    ? "text-[#555]  decoration-[#444]"
                    : "text-[#EDEDED]"
                  }
                `}
              >
                {todo.title}
              </p>
              {todo.description && (
                <p
                  className={`
                    text-xs mt-0.75 leading-normal  transition-colors duration-150
                    ${todo.completed ? "text-[#707070]" : "text-[#bbb]"}
                  `}
                >
                  {todo.description}
                </p>
                
              )}
              {
               todo.createdAt && (
                <p
                  className='text-xs mt-0.75 leading-normal text-[#575757]'
                  > {new Date(todo.createdAt).toLocaleString()} </p>)
              }

            </div>
                <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="hover:scale-105"
                aria-label="Edit"
              >
                <Pencil size={13} strokeWidth={1.8} className="text-[#A3A3A3] hover:text-white" />
              </button>
              <button
                onClick={deleteTodo}
                className="w-[26px] h-[26px] flex items-center justify-center rounded-[6px] hover:bg-[#2F2F2F] group/del transition-colors duration-150"
                aria-label="Delete"
              >
                {
                    deleting?(<Loader size={13} strokeWidth={1.8} className="text-[#da4545] animate-spin " />) : (
                        <Trash2
                  size={13}
                  strokeWidth={1.8}
                  className="text-[#A3A3A3] group-hover/del:text-red-400 transition-colors duration-150"
                /> )
                }
              </button>
            </div>
          
          </motion.div>
        ) : (
          /* Edit mode */
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex flex-col gap-[8px] px-3 py-[10px] rounded-[8px] bg-[#1E1E1E] border border-[#2F2F2F]"
          >
            <input
              autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setIsEditing(false);
              }}
              className="
                w-full bg-transparent
                text-[14px] text-[#EDEDED]
                placeholder:text-[#555]
                outline-none border-none
                focus:ring-0
              "
              placeholder="Title"
            />
            <div className="h-px bg-[#2F2F2F]" />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="
                w-full bg-transparent resize-none
                text-[12px] text-[#A3A3A3] leading-[1.5]
                placeholder:text-[#3A3A3A]
                outline-none border-none
                focus:ring-0
              "
              placeholder="Description"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="
                  flex items-center gap-1
                  px-3 py-1.5 rounded-[6px]
                  text-[12px] text-[#A3A3A3]
                  hover:bg-[#2A2A2A]
                  transition-colors duration-150
                "
              >
                <X size={11} strokeWidth={2} />
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={loading || !editTitle.trim()}
                className="
                  flex items-center gap-1
                  px-3 py-1.5 rounded-[6px]
                  text-[12px] font-medium
                  bg-[#EDEDED] text-[#191919]
                  hover:bg-white
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-150 active:scale-[0.98]
                "
              >
                {loading ? <p className="flex items-center gap-1">saving <Loader width={12} className="text-black animate-spin"/></p> : "Save"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TodoCard;