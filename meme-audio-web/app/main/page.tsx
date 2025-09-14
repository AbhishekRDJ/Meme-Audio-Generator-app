"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Audio {
    _id: string;
    title: string;
    url: string;
    createdAt: string;
    uploader?: {
        username: string;
        email: string;
    };
    originalUrl: string;
}

export default function HomePage() {
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [audios, setAudios] = useState<Audio[]>([]);
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

    const fetchAudios = async () => {
        try {
            const res = await api.get("/api/v1/audio/all");
            console.log("Fetched audios:", res.data);
            setAudios(res.data);
        } catch (error: any) {
            console.error("Failed to fetch audios:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/");
            return;
        }

        // Get user info from token if available
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser({ id: payload.id });
        } catch (error) {
            console.error("Invalid token");
        }

        fetchAudios();
    }, [router]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || !title.trim()) {
            alert("Please fill in both URL and title fields");
            return;
        }

        setLoading(true);
        try {
            console.log("Sending request:", { url: url.trim(), title: title.trim() });
            const res = await api.post("/api/v1/audio/upload", { url: url.trim(), title: title.trim() });
            console.log("Generation response:", res.data);

            if (res.data && res.data.message) {
                alert(res.data.message);
            } else {
                alert("Audio generated successfully!");
            }

            // Refresh the audio list
            await fetchAudios();
            setUrl("");
            setTitle("");
        } catch (err: any) {
            console.error("Generation error:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Generation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (audioUrl: string, audioTitle: string) => {
        console.log("Downloading:", audioUrl);
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = `${audioTitle.replace(/[^a-z0-9]/gi, "_")}.mp3`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/");
    };

    return (
        <div className="bg-black min-h-screen">
            {/* Header */}
            <header className="bg-gray-900 shadow-2xl border-gray-800 border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-6 py-4 max-w-7xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl w-10 h-10">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h1 className="bg-clip-text bg-gradient-to-r from-white to-gray-300 font-bold text-transparent text-xl sm:text-2xl">
                                    AudioGen Pro
                                </h1>
                                <p className="text-gray-400 text-xs">Professional Audio Generation Platform</p>
                            </div>
                        </div>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/explore"
                                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="font-medium">Explore</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 border border-red-500 hover:border-red-400 rounded-lg text-white transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                aria-label="Toggle menu"
                                onClick={() => setMenuOpen((s) => !s)}
                                className="bg-gray-800 hover:bg-gray-700 p-2 border border-gray-700 rounded-md text-gray-300"
                            >
                                {menuOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu content */}
                {menuOpen && (
                    <div className="md:hidden bg-gray-900 px-4 pb-4 border-gray-800 border-t">
                        <div className="space-y-2">
                            <Link
                                href="/explore"
                                onClick={() => setMenuOpen(false)}
                                className="block bg-gray-800 hover:bg-gray-700 px-4 py-2 border border-gray-700 rounded-lg w-full text-gray-300 text-left"
                            >
                                Explore
                            </Link>
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleLogout();
                                }}
                                className="block bg-red-600 hover:bg-red-700 px-4 py-2 border border-red-500 rounded-lg w-full text-white text-left"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <div className="mx-auto px-4 sm:px-6 lg:px-6 py-8 max-w-7xl">
                {/* Hero Section */}
                <div className="mb-8 sm:mb-12 text-center">
                    <h2 className="bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-3 font-bold text-transparent text-2xl sm:text-3xl md:text-4xl">
                        Transform Videos into Audio
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-400 text-sm sm:text-lg">
                        Generate high-quality audio files from YouTube videos with our professional-grade conversion platform
                    </p>
                </div>

                {/* Generation Form */}
                <div className="bg-gray-900 shadow-2xl mb-8 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 p-5 sm:p-6 border-gray-800 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg w-8 h-8">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="font-semibold text-white text-lg">Create New Audio</h2>
                        </div>

                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleGenerate} className="space-y-6">
                                <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="font-medium text-gray-300 text-sm">YouTube URL</label>
                                        <div className="relative">
                                            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                </svg>
                                            </div>
                                            <input
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="bg-gray-800 py-3 pr-4 pl-10 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-medium text-gray-300 text-sm">Audio Title</label>
                                        <div className="relative">
                                            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                            </div>
                                            <input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Enter a descriptive title..."
                                                className="bg-gray-800 py-3 pr-4 pl-10 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center lg:justify-start">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-gradient-to-r from-purple-600 hover:from-purple-700 disabled:from-gray-600 to-blue-600 hover:to-blue-700 disabled:to-gray-700 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl w-full lg:w-auto font-semibold text-white disabled:transform-none hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed transform"
                                    >
                                        {loading ? (
                                            <span className="flex justify-center items-center">
                                                <div className="mr-3 border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex justify-center items-center">
                                                <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                                </svg>
                                                Generate Audio
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Generated Audios */}
                <div className="bg-gray-900 shadow-2xl border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 p-5 sm:p-6 border-gray-800 border-b">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="flex justify-center items-center bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg w-8 h-8">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-white text-lg">Your Audio Library</h2>
                                    <p className="text-gray-400 text-sm">{audios.length} audio files generated</p>
                                </div>
                            </div>
                            <button
                                onClick={fetchAudios}
                                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="font-medium text-sm">Refresh</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {audios.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="flex justify-center items-center bg-gray-800 mx-auto mb-4 rounded-full w-16 h-16">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-medium text-gray-400 text-lg">No audio files yet</h3>
                                <p className="text-gray-500">Generate your first audio file using the form above</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {audios.map((audio, index) => (
                                    <div
                                        key={audio._id}
                                        className={`group p-5 border rounded-xl transition-all duration-300 hover:shadow-lg ${index === 0
                                            ? "bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 shadow-lg"
                                            : "bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-gray-600"
                                            }`}
                                    >
                                        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start sm:items-center space-x-3 mb-3 sm:mb-0">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === 0 ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gray-700"}`}>
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343A8 8 0 108 21a8 8 0 00-6.657-14.657z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className={`font-semibold text-white truncate ${index === 0 ? "text-lg" : "text-base"}`}>
                                                                {audio.title}
                                                            </h3>
                                                            {index === 0 && (
                                                                <span className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full font-semibold text-white text-xs">
                                                                    Latest
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4 mt-1 text-sm">
                                                            <p className="text-gray-400">
                                                                {new Date(audio.createdAt).toLocaleDateString("en-US", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </p>
                                                            {audio.uploader?.username && (
                                                                <p className="text-gray-500">By {audio.uploader.username}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Buttons group: on mobile stack vertically, on sm+ show inline */}
                                            <div className="flex sm:flex-row flex-col sm:items-center sm:space-x-3 mt-3 sm:mt-0">
                                                <button
                                                    onClick={() => handleDownload(audio.url, audio.title)}
                                                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 w-full sm:w-auto ${index === 0
                                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                                                        : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span>Download</span>
                                                </button>

                                                <a
                                                    href={audio.originalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex justify-center items-center space-x-2 bg-red-600 hover:bg-red-700 mt-2 sm:mt-0 px-4 py-2 rounded-lg w-full sm:w-auto font-medium text-white hover:scale-105 transition-all duration-200 transform"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    <span>Source</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
