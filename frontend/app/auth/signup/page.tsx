"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`,
        { name, email, password },
        { withCredentials: true }
      );

      console.log(res.data);
      router.push("/home");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#191919] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[20px] text-[#EDEDED] font-medium">
            Create account
          </h1>
          <p className="text-[13px] text-[#555] mt-1">
            Start organizing your tasks
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          
          <div>
            <label className="text-[12px] text-[#888]">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-[#202020] border border-[#2F2F2F] rounded-lg px-3 py-2 text-sm text-[#EDEDED] placeholder:text-[#555] outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>

          <div>
            <label className="text-[12px] text-[#888]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-[#202020] border border-[#2F2F2F] rounded-lg px-3 py-2 text-sm text-[#EDEDED] placeholder:text-[#555] outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>

          <div>
            <label className="text-[12px] text-[#888]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-[#202020] border border-[#2F2F2F] rounded-lg px-3 py-2 text-sm text-[#EDEDED] placeholder:text-[#555] outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="mt-2 w-full bg-[#EDEDED] text-black py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#2F2F2F]" />
          <span className="text-[11px] text-[#555]">or</span>
          <div className="flex-1 h-px bg-[#2F2F2F]" />
        </div>

        {/* Secondary */}
        <button className="w-full border border-[#2F2F2F] text-[#EDEDED] py-2 rounded-lg text-sm hover:bg-[#202020] transition"
         onClick={() => router.push("/auth/login")}>
          Continue as guest
        </button>

        {/* Footer */}
        <p className="text-center text-[12px] text-[#555] mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-[#EDEDED] cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}