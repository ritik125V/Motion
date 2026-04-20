"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import axios from "axios";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    if (!password) { setError("Password is required."); return; }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      router.push("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    setError("");
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/guest-login`,
        {},
        { withCredentials: true }
      );
      router.push("/home");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Guest login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `
    w-full bg-[#202020] border border-[#2F2F2F] rounded-[8px]
    px-3 py-[9px] text-[13px] text-[#EDEDED]
    placeholder:text-[#3A3A3A] outline-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/[0.12]
    transition-all duration-150
  `;

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center px-4">
      <div className="w-full max-w-[320px]">

        <h1 className="text-[17px] font-medium text-[#EDEDED] text-center tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-[13px] text-[#555] text-center mb-6">
          Sign in to continue
        </p>

        {error && (
          <div className="mb-3 px-3 py-[9px] rounded-[8px] bg-[#1E1E1E] border border-[#3A1F1F]">
            <p className="text-[12px] text-red-400">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-[8px] mb-3">
          <div className="flex flex-col gap-[5px]">
            <label className="text-[12px] text-[#A3A3A3]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label className="text-[12px] text-[#A3A3A3]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className={inputClass}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full bg-[#EDEDED] hover:bg-white
            text-[#191919] rounded-lg
            py-2.5 text-[13px] font-medium
            items-center justify-center flex
            transition-all duration-150 active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
            mb-2
          "
        >
          {loading ? <p className="flex items-center gap-1">signing in <Loader width={12} className="text-black animate-spin"/></p> : "Sign in"}
        </button>

        <div className="flex items-center gap-[10px] my-3">
          <div className="flex-1 h-px bg-[#262626]" />
          <span className="text-[11px] text-[#3A3A3A]">or</span>
          <div className="flex-1 h-px bg-[#262626]" />
        </div>

        <button
          onClick={handleGuestLogin}
          disabled={loading}
          className="
            w-full bg-transparent
            border border-[#2F2F2F] hover:border-[#3F3F3F] hover:bg-[#242424]
            text-[#A3A3A3] hover:text-[#EDEDED]
            rounded-[8px] py-[9px] text-[13px]
            transition-all duration-150 active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          Continue as guest
        </button>

        <p className="text-[13px] text-[#555] text-center mt-5">
          No account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-[#A3A3A3] hover:text-[#EDEDED] cursor-pointer transition-colors duration-150"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}