"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

interface Audio {
    _id: string;
    title: string;
    url: string;
    originalUrl: string;
    createdAt: string;
    uploader?: {
        username: string;
        email: string;
    };
}

export default function ExplorePage() {
    const router = useRouter();
    const [audios, setAudios] = useState<Audio[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredAudios, setFilteredAudios] = useState<Audio[]>([]);
    const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle

    const fetchAllAudios = async () => {
        try {
            const res = await api.get("/api/v1/audio/all");
            setAudios(res.data);
            setFilteredAudios(res.data);
        } catch (error) {
            console.error("Failed to fetch audios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/");
            return;
        }
        fetchAllAudios();
    }, [router]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredAudios(audios);
        } else {
            const filtered = audios.filter(audio =>
                audio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                audio.uploader?.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAudios(filtered);
        }
    }, [searchQuery, audios]);

    const handleDownload = (audioUrl: string, audioTitle: string) => {
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = `${audioTitle.replace(/[^a-z0-9]/gi, '_')}.mp3`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-black min-h-screen">
                <div className="text-center">
                    <div className="flex justify-center items-center mx-auto mb-6 rounded-full w-16 h-16">
                        <div className="border-4 border-gray-800 border-t-purple-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                    <h3 className="mb-2 font-semibold text-white text-lg">Loading Community</h3>
                    <p className="text-gray-400">Discovering amazing audio content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen">
            {/* Header */}
            <header className="bg-gray-900 shadow-2xl border-gray-800 border-b">
                <div className="mx-auto px-4 sm:px-6 lg:px-6 py-4 max-w-7xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="flex justify-center items-center bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl w-10 h-10">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9v18" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h1 className="bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold text-transparent text-lg sm:text-2xl">
                                    Community Hub
                                </h1>
                                <p className="text-gray-400 text-xs">Discover & Download Audio Content</p>
                            </div>
                        </div>

                        {/* Desktop links */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/main"
                                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6" />
                                </svg>
                                <span className="font-medium">Home</span>
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
                                onClick={() => setMenuOpen(s => !s)}
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

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden bg-gray-900 px-4 pb-4 border-gray-800 border-t">
                        <div className="space-y-2">
                            <Link
                                href="/main"
                                onClick={() => setMenuOpen(false)}
                                className="block bg-gray-800 hover:bg-gray-700 px-4 py-2 border border-gray-700 rounded-lg w-full text-gray-300 text-left"
                            >
                                Home
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
                <div className="mb-6 sm:mb-8 text-center">
                    <h2 className="bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 font-bold text-transparent text-xl sm:text-2xl md:text-3xl">
                        Explore Community Creations
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-lg">
                        Discover and download amazing audio content created by our community
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-gray-900 shadow-2xl mb-6 sm:mb-8 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 p-4 sm:p-6 border-gray-800 border-b">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="flex justify-center items-center bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg w-8 h-8">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-white text-base sm:text-lg">Search & Filter</h3>
                            </div>

                            {/* Desktop controls */}
                            <div className="hidden md:flex items-center space-x-3">
                                <div className="bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg">
                                    <div className="text-gray-400 text-sm">
                                        <span className="font-semibold text-white">{filteredAudios.length}</span> of <span className="font-semibold text-white">{audios.length}</span> files
                                    </div>
                                </div>
                                <button
                                    onClick={fetchAllAudios}
                                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="font-medium text-sm">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
                            <div className="relative flex-1 w-full md:max-w-2xl">
                                <div className="left-0 absolute inset-y-0 flex items-center pl-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by title, creator, or keywords..."
                                    className="bg-gray-800 py-3 pr-4 pl-12 border border-gray-700 focus:border-transparent rounded-xl outline-none focus:ring-2 focus:ring-purple-500 w-full text-white transition-all duration-200 placeholder-gray-500"
                                />
                            </div>

                            {/* Mobile controls under search */}
                            <div className="flex justify-between md:justify-end items-center gap-3 w-full md:w-auto">
                                <div className="bg-gray-800 px-4 py-2 border border-gray-700 rounded-lg">
                                    <div className="text-gray-400 text-sm">
                                        <span className="font-semibold text-white">{filteredAudios.length}</span> of <span className="font-semibold text-white">{audios.length}</span> files
                                    </div>
                                </div>
                                <button
                                    onClick={fetchAllAudios}
                                    className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="font-medium text-sm">Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Audio Grid */}
                {filteredAudios.length === 0 ? (
                    <div className="bg-gray-900 shadow-2xl p-8 sm:p-16 border border-gray-800 rounded-2xl text-center">
                        <div className="flex justify-center items-center bg-gray-800 mx-auto mb-6 rounded-full w-20 h-20">
                            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <h3 className="mb-3 font-bold text-gray-300 text-xl sm:text-2xl">
                            {searchQuery ? "No Results Found" : "No Audio Files Yet"}
                        </h3>
                        <p className="text-gray-500 text-base sm:text-lg">
                            {searchQuery ? "Try adjusting your search terms or browse all content" : "Be the first to create and share audio content with the community!"}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="bg-purple-600 hover:bg-purple-700 mt-4 px-6 py-2 rounded-lg text-white transition-all duration-200"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredAudios.map((audio, index) => (
                            <div
                                key={audio._id}
                                className="group bg-gray-900 shadow-xl hover:shadow-2xl border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300"
                            >
                                <div className="p-5 sm:p-6">
                                    {/* Header */}
                                    <div className="flex items-start sm:items-center space-x-3 mb-4">
                                        <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl w-12 h-12">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343A8 8 0 108 21a8 8 0 00-6.657-14.657z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="mb-1 font-semibold text-white group-hover:text-cyan-400 text-base sm:text-lg line-clamp-2 transition-colors duration-200">
                                                {audio.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <div className="flex justify-center items-center bg-gray-700 mr-2 rounded-full w-5 h-5">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-300 truncate">{audio.uploader?.username || "Anonymous Creator"}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400 text-sm">
                                            <div className="flex justify-center items-center bg-gray-700 mr-2 rounded-full w-5 h-5">
                                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-gray-300">
                                                {new Date(audio.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleDownload(audio.url, audio.title)}
                                            className="flex justify-center items-center space-x-2 bg-gradient-to-r from-cyan-600 hover:from-cyan-700 to-purple-600 hover:to-purple-700 shadow-lg px-4 py-3 rounded-xl w-full font-semibold text-white hover:scale-105 transition-all duration-200 transform"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>Download MP3</span>
                                        </button>
                                        <a
                                            href={audio.originalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-center items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 border border-gray-700 hover:border-gray-600 rounded-xl w-full font-medium text-gray-300 hover:text-white transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <span>View Source</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
