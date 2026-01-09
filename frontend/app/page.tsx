/**
 * Enhanced Landing Page
 * Includes interview customization options
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Zap, Brain, Trophy } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { InterviewRole, DifficultyLevel } from '@/types';

export default function Home() {
    const router = useRouter();
    const { startInterview } = useInterviewStore();

    const [role, setRole] = useState<InterviewRole>(InterviewRole.FULLSTACK);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.MID);
    const [duration, setDuration] = useState(30);

    // Load from localStorage after hydration (prevents SSR mismatch)
    useEffect(() => {
        const store = useInterviewStore.getState();
        store.loadFromLocalStorage();
    }, []);

    const handleStartInterview = () => {
        startInterview({ role, difficulty, duration });
        router.push('/interview');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-gray-900 to-black text-white">
            {/* Header Badge */}
            <div className="mb-8 animate-fade-in">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-full">
                    <p className="text-sm font-semibold text-blue-300">AI-Powered Technical Interviews</p>
                </div>
            </div>

            {/* Main Hero */}
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-br after:from-sky-900 after:via-[#0141ff] after:opacity-40 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
                <div className="text-center max-w-3xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-600">
                        AI Video Interviewer
                    </h1>
                    <p className="text-xl text-gray-400 mb-12">
                        Experience a real-time technical interview with an interactive AI.
                        Powered by Google Gemini for transcription and intelligent question generation.
                    </p>

                    {/* Customization Form */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8 text-left animate-slide-up">
                        <h2 className="text-2xl font-semibold mb-6 text-center">Customize Your Interview</h2>

                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Position</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value as InterviewRole)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                            >
                                {Object.values(InterviewRole).map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Difficulty Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.values(DifficultyLevel).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${difficulty === d
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                Duration: {duration} minutes
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="60"
                                step="5"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>10 min</span>
                                <span>60 min</span>
                            </div>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartInterview}
                            className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition duration-300 flex items-center justify-center gap-2 text-lg"
                        >
                            Start Interview <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="mt-20 grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-3 lg:text-left gap-8 animate-slide-up">
                <div className="group rounded-xl border border-transparent px-6 py-5 transition-colors hover:border-gray-300 hover:bg-gray-100/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Real-time</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Low latency interactions with instant transcription using Google Gemini API.
                    </p>
                </div>

                <div className="group rounded-xl border border-transparent px-6 py-5 transition-colors hover:border-gray-300 hover:bg-gray-100/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Adaptive</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Questions dynamically adapt to your responses and skill level.
                    </p>
                </div>

                <div className="group rounded-xl border border-transparent px-6 py-5 transition-colors hover:border-gray-300 hover:bg-gray-100/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold">Export</h2>
                    </div>
                    <p className="text-sm text-gray-400">
                        Get detailed transcripts and analysis in PDF or JSON format.
                    </p>
                </div>
            </div>
        </main>
    );
}

