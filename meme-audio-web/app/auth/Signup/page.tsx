"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api, { setAuthToken } from "@/lib/api";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/api/v1/auth/signup", form);
            const { token } = res.data;
            localStorage.setItem("authToken", token);
            setAuthToken(token);
            router.push("/main");
        } catch (err: any) {
            alert(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-black p-2 min-h-screen overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="-top-40 -right-40 absolute bg-purple-600 opacity-10 blur-3xl rounded-full w-80 h-80 animate-pulse mix-blend-multiply filter"></div>
                <div className="-bottom-40 -left-40 absolute bg-cyan-600 opacity-10 blur-3xl rounded-full w-80 h-80 animate-pulse animation-delay-2000 mix-blend-multiply filter"></div>
                <div className="top-1/3 left-1/4 absolute bg-blue-600 opacity-5 blur-3xl rounded-full w-60 h-60 animate-pulse animation-delay-4000 mix-blend-multiply filter"></div>
            </div>

            <div className="z-10 relative flex justify-center items-center px-6 min-h-screen">
                <div className="w-full max-w-lg">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Link href="/" className="inline-block">
                            <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-cyan-600 shadow-2xl mx-auto mb-4 rounded-2xl w-16 h-16 hover:scale-105 transition-transform duration-200">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                        </Link>
                        <h1 className="bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 font-bold text-transparent text-3xl">
                            AudioGen Pro
                        </h1>
                        <p className="mt-2 text-gray-400">Professional Audio Generation Platform</p>
                    </div>

                    {/* Signup Form */}
                    <div className="bg-gray-900 shadow-2xl border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 p-6 border-gray-800 border-b">
                            <div className="text-center">
                                <h2 className="mb-2 font-bold text-white text-2xl">Create Your Account</h2>
                                <p className="text-gray-400">Join thousands of creators transforming audio</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-8">
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="font-medium text-gray-300 text-sm">Username</label>
                                    <div className="relative">
                                        <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            name="username"
                                            placeholder="Choose a unique username"
                                            value={form.username}
                                            onChange={handleChange}
                                            className="bg-gray-800 py-3 pr-4 pl-10 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-purple-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-medium text-gray-300 text-sm">Email Address</label>
                                    <div className="relative">
                                        <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="bg-gray-800 py-3 pr-4 pl-10 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-purple-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-medium text-gray-300 text-sm">Password</label>
                                    <div className="relative">
                                        <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            placeholder="Create a secure password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="bg-gray-800 py-3 pr-4 pl-10 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-purple-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-600 hover:from-purple-700 disabled:from-gray-600 to-cyan-600 hover:to-cyan-700 disabled:to-gray-700 shadow-lg hover:shadow-xl px-6 py-4 rounded-xl w-full font-semibold text-white disabled:transform-none hover:scale-105 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed transform"
                            >
                                {loading ? (
                                    <span className="flex justify-center items-center">
                                        <div className="mr-3 border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                                        Creating Your Account...
                                    </span>
                                ) : (
                                    <span className="flex justify-center items-center">
                                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Create Account
                                    </span>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-gray-400">
                                    Already part of our community?{" "}
                                    <Link href="/auth/Login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Features Preview */}
                    <div className="bg-gray-900 shadow-2xl mt-8 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="mb-4 font-semibold text-white text-lg text-center">What You'll Get</h3>
                            <div className="gap-4 grid grid-cols-2">
                                <div className="text-center">
                                    <div className="flex justify-center items-center bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-2 rounded-xl w-12 h-12">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-300 text-sm">Fast Conversion</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-2 rounded-xl w-12 h-12">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-300 text-sm">Cloud Storage</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-600 mx-auto mb-2 rounded-xl w-12 h-12">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-300 text-sm">Community</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex justify-center items-center bg-gradient-to-br from-orange-500 to-red-600 mx-auto mb-2 rounded-xl w-12 h-12">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-gray-300 text-sm">HD Quality</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            By creating an account, you agree to our{" "}
                            <span className="text-gray-400 hover:text-gray-300 cursor-pointer">Terms of Service</span> and{" "}
                            <span className="text-gray-400 hover:text-gray-300 cursor-pointer">Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}