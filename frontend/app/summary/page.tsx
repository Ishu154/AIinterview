/**
 * Interview Summary Page
 * Displays results and transcript with export options
 */

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useInterviewStore } from '@/store/interviewStore';
import { exportTranscript } from '@/lib/export';
import { Download, FileJson, Home, RotateCcw } from 'lucide-react';

export default function SummaryPage() {
    const router = useRouter();
    const { session, resetInterview } = useInterviewStore();

    // Load from localStorage after hydration
    useEffect(() => {
        const store = useInterviewStore.getState();
        store.loadFromLocalStorage();
    }, []);

    const handleExportPDF = () => {
        exportTranscript(session, { format: 'pdf', includeMetadata: true, includeTimestamps: false });
    };

    const handleExportJSON = () => {
        exportTranscript(session, { format: 'json', includeMetadata: true });
    };

    const handleRetake = () => {
        resetInterview();
        router.push('/');
    };

    const duration = session.startTime && session.endTime
        ? Math.floor((session.endTime - session.startTime) / 1000)
        : 0;

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-500 mb-4">
                        Interview Complete!
                    </h1>
                    <p className="text-gray-400">
                        Thank you for participating. Here's a summary of your interview.
                    </p>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{session.questionsAnswered}</div>
                        <div className="text-sm text-gray-400">Questions Answered</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="text-3xl font-bold text-emerald-400 mb-2">{formatDuration(duration)}</div>
                        <div className="text-sm text-gray-400">Duration</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                        <div className="text-3xl font-bold text-purple-400 mb-2">{session.config.role}</div>
                        <div className="text-sm text-gray-400">Position</div>
                    </div>
                </div>

                {/* Export Options */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 animate-slide-up">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-blue-400" />
                        Export Transcript
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExportPDF}
                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Export as PDF
                        </button>
                        <button
                            onClick={handleExportJSON}
                            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <FileJson className="w-4 h-4" />
                            Export as JSON
                        </button>
                    </div>
                </div>

                {/* Transcript */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 animate-slide-up">
                    <h2 className="text-xl font-semibold mb-4">Full Transcript</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {session.conversationHistory.map((entry, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${entry.speaker === 'AI'
                                    ? 'bg-blue-900/20 border border-blue-800/30'
                                    : 'bg-emerald-900/20 border border-emerald-800/30'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-400">{entry.speaker}</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-gray-200">{entry.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 animate-slide-up">
                    <Link
                        href="/"
                        className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                    <button
                        onClick={handleRetake}
                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Retake Interview
                    </button>
                </div>
            </div>
        </div>
    );
}
