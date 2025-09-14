"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuthToken } from "../lib/api";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthToken(token);
      router.push("/main");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-black h-screen">
        <div className="text-center animate-fadeIn">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-purple-500 border-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 flex justify-center items-center bg-gray-900 rounded-full">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 
                     2s-3-.895-3-2 1.343-2 3-2 3 
                     .895 3 2zm12-3c0 1.105-1.343 2-3 
                     2s-3-.895-3-2 1.343-2 3-2 3 
                     .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
          </div>
          <h3 className="mb-2 font-semibold text-white text-lg">
            Initializing AudioGen Pro
          </h3>
          <p className="text-gray-400">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black px-6 py-10 min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute bg-purple-600 opacity-10 blur-3xl rounded-full w-80 h-80 animate-pulse" />
        <div className="-bottom-40 -left-40 absolute bg-cyan-600 opacity-10 blur-3xl rounded-full w-80 h-80 animate-pulse delay-1000" />
        <div className="top-1/2 left-1/2 absolute bg-blue-600 opacity-5 blur-3xl rounded-full w-60 h-60 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000" />
      </div>

      {/* Main content */}
      <div className="z-10 relative flex flex-col justify-center items-center space-y-12 min-h-screen">
        {/* Branding */}
        <div className="text-center animate-fadeIn">
          <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-cyan-600 shadow-2xl mx-auto mb-6 rounded-2xl w-20 h-20">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 
                   2-3 2s-3-.895-3-2 1.343-2 3-2 
                   3 .895 3 2zm12-3c0 1.105-1.343 
                   2-3 2s-3-.895-3-2 1.343-2 
                   3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
          <h1 className="bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 font-bold text-transparent text-5xl">
            AudioGen Pro
          </h1>
          <p className="mt-3 text-gray-400 text-xl">
            Professional Audio Generation Platform
          </p>
          <p className="text-gray-500">
            Transform YouTube content into high-quality audio files
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-900/90 shadow-xl border border-gray-800 rounded-2xl w-full max-w-md animate-fadeUp">
          <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 p-6 border-gray-800 border-b">
            <h2 className="font-semibold text-white text-xl text-center">
              Get Started
            </h2>
            <p className="mt-1 text-gray-400 text-sm text-center">
              Choose your preferred way to continue
            </p>
          </div>

          <div className="space-y-4 p-8">
            <Link href="/auth/Login">
              <button className="flex justify-center items-center space-x-2 bg-gradient-to-r from-purple-600 hover:from-purple-700 to-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-2xl mb-5 px-6 py-4 rounded-xl w-full font-semibold text-white hover:scale-105 transition duration-300 cursor-pointer transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 
                       4h14m-5 4v1a3 3 0 01-3 
                       3H6a3 3 0 01-3-3V7a3 3 
                       0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Login to Account</span>
              </button>
            </Link>

            <Link href="/auth/Signup">
              <button className="flex justify-center items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-6 py-4 border border-gray-700 hover:border-gray-600 rounded-xl w-full font-semibold text-gray-200 hover:scale-105 transition duration-300 cursor-pointer transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 
                       0h-3m-2-5a4 4 0 11-8 0 
                       4 4 0 018 0zM3 20a6 6 
                       0 0112 0v1H3v-1z"
                  />
                </svg>
                <span>Create New Account</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-6 bg-gray-900/90 shadow-xl p-6 border border-gray-800 rounded-2xl w-full max-w-2xl animate-fadeUp">
          <h3 className="font-semibold text-white text-lg text-center">
            Platform Features
          </h3>
          <div className="gap-6 grid md:grid-cols-2">
            {[
              {
                title: "Lightning Fast Conversion",
                desc: "Convert YouTube videos to MP3 in seconds",
                color: "from-green-500 to-emerald-600",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
              {
                title: "Cloud Storage & Sync",
                desc: "Access your files anywhere, anytime",
                color: "from-blue-500 to-indigo-600",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 
                       5 0 1115.9 6L16 6a5 5 0 011 
                       9.9M9 19l3 3m0 0l3-3m-3 
                       3V10"
                  />
                ),
              },
              {
                title: "Community Sharing",
                desc: "Discover and share amazing content",
                color: "from-purple-500 to-pink-600",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 
                       00-5.356-1.857M17 
                       20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 
                       20H2v-2a3 3 0 
                       015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 
                       0a5.002 5.002 0 019.288 0M15 
                       7a3 3 0 11-6 0 3 3 0 016 
                       0zm6 3a2 2 0 11-4 0 2 2 0 
                       014 0zM7 10a2 2 0 11-4 0 2 
                       2 0 014 0z"
                  />
                ),
              },
              {
                title: "Premium Quality",
                desc: "Professional-grade audio processing",
                color: "from-orange-500 to-red-600",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 
                       0 11-18 0 9 9 0 0118 0z"
                  />
                ),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start space-x-4 bg-gray-800/40 p-4 rounded-lg"
              >
                <div
                  className={`flex justify-center items-center w-12 h-12 rounded-lg bg-gradient-to-br ${f.color}`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {f.icon}
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white">{f.title}</h4>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-gray-500 text-xs text-center">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
}
