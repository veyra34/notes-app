"use client";

import InputFields from "@/components/InputFields";
import { User, Mail, Lock, Eye, Shield, Cloud, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex bg-[#1e2330]">
      
      {/* --- LEFT SIDE --- */}
      <div className="w-1/2 relative flex flex-col text-white px-16 py-12 overflow-hidden">
        
        {/* Background Dots */}
        <div className="absolute top-0 left-0 grid grid-cols-4 gap-2 opacity-20 p-6 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
          ))}
        </div>

        {/* Logo - Pinned to Top */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <div className="h-10 w-10 border-[1.5px] border-white rounded-lg flex items-center justify-center font-bold text-lg">
            N
          </div>
          <h1 className="text-xl font-bold">Notes</h1>
        </div>

        {/* Main Centered Content 
          flex-1 allows this div to take up all space below the logo.
          justify-center pushes everything inside it to the absolute middle.
        */}
        <div className="flex-1 flex flex-col justify-center relative z-10">
          
          {/* Inner Wrapper - keeps text and features grouped tightly together */}
          <div className="w-full max-w-md mx-auto space-y-12">
            
            {/* Hero Text */}
            <div>
              <h2 className="text-[44px] font-bold leading-[1.15]">
                Create your account
                <br />
                and get started
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                Join now and start organizing
                <br />
                your notes effortlessly.
              </p>
              <div className="mt-8 ml-4">
                <img
                  src="/notebook_icon.webp"
                  alt="Notebook"
                  className="w-[280px] object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#2a3040] flex items-center justify-center text-white shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px]">Secure & Private</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Your data is encrypted and always protected.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#2a3040] flex items-center justify-center text-white shrink-0">
                  <Cloud size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px]">Access Anywhere</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Access your notes from any device, anytime.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#2a3040] flex items-center justify-center text-white shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[15px]">Stay Productive</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Organize, plan and achieve more every day.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="w-1/2 flex items-center justify-center bg-[#1e2330] p-8">
        <div className="bg-white w-full max-w-[420px] max-h-[95vh] overflow-y-auto rounded-3xl shadow-xl px-8 py-8 z-10 custom-scrollbar">
          <div className="text-center mb-6">
            <h2 className="text-[22px] font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Fill in the details below to get started
            </p>
          </div>

          <div className="space-y-3">
            <InputFields
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User size={18} className="text-gray-400" />}
            />

            <InputFields
              label="Email"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} className="text-gray-400" />}
            />

            <div>
              <InputFields
                label="Password"
                placeholder="Create a password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} className="text-gray-400" />}
                showPasswordToggle
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <InputFields
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={18} className="text-gray-400" />}
              showPasswordToggle
            />
          </div>

          <div className="mt-4 flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#2b364a] focus:ring-[#2b364a]"
            />
            <p className="text-xs text-gray-500 leading-tight">
              I agree to the{" "}
              <span className="text-blue-600 font-medium cursor-pointer hover:underline">Terms of Service</span>
              {" "}and{" "}
              <span className="text-blue-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>

          <button 
            onClick={() => router.push("/dashboard")}
            className="mt-5 w-full rounded-xl bg-[#2b364a] py-3 text-[15px] font-semibold text-white transition hover:bg-[#1e2638] active:scale-95"
          >
            Create Account
          </button>

          <div className="my-5 flex items-center">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="px-4 text-xs text-gray-400">Or sign up with</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.233 17.64 11.925 17.64 9.2z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}