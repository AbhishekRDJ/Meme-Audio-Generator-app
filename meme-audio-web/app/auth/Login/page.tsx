"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api, { setAuthToken } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/api/v1/auth/login", form);
            const { token } = res.data;
            localStorage.setItem("authToken", token);
            setAuthToken(token);
            router.push("/main");
        } catch (err: any) {
            alert(err.response?.data?.message || "Login failed");
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
                <div className="top-1/3 right-1/4 absolute bg-blue-600 opacity-5 blur-3xl rounded-full w-60 h-60 animate-pulse animation-delay-4000 mix-blend-multiply filter"></div>
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

                    {/* Login Form */}
                    <div className="bg-gray-900 shadow-2xl border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 p-6 border-gray-800 border-b">
                            <div className="text-center">
                                <h2 className="mb-2 font-bold text-white text-2xl">Welcome Back</h2>
                                <p className="text-gray-400">Continue your audio creation journey</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-8">
                            <div className="space-y-5">
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
                                            placeholder="Enter your registered email"
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
                                            placeholder="Enter your password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="bg-gray-800 py-3 pr-4 pl-10 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-purple-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="bg-gray-800 border-gray-600 rounded focus:ring-purple-500 w-4 h-4 text-purple-600"
                                    />
                                    <label htmlFor="remember-me" className="block ml-2 text-gray-300 text-sm">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                                        Forgot password?
                                    </a>
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
                                        Signing You In...
                                    </span>
                                ) : (
                                    <span className="flex justify-center items-center">
                                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Sign In to Continue
                                    </span>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-gray-400">
                                    New to AudioGen Pro?{" "}
                                    <Link href="/auth/Signup" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-200">
                                        Create account
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gray-900 shadow-2xl mt-8 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6">
                            <h3 className="mb-4 font-semibold text-white text-lg text-center">Join Our Community</h3>
                            <div className="gap-4 grid grid-cols-3">
                                <div className="text-center">
                                    <div className="mb-1 font-bold text-cyan-400 text-2xl">10K+</div>
                                    <div className="text-gray-400 text-xs">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-1 font-bold text-purple-400 text-2xl">50K+</div>
                                    <div className="text-gray-400 text-xs">Files Created</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-1 font-bold text-pink-400 text-2xl">99.9%</div>
                                    <div className="text-gray-400 text-xs">Uptime</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Your data is protected with enterprise-grade security</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}