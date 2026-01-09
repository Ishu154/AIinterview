/**
 * Enhanced Interview Page
 * Uses all new hooks, components, and state management
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedAvatar from '@/components/AvatarPlayer';
import WebcamCapture from '@/components/WebcamCapture';
import ProgressIndicator from '@/components/ProgressIndicator';
import InterviewControls from '@/components/InterviewControls';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useInterview } from '@/hooks/useInterview';
import { useInterviewStore } from '@/store/interviewStore';
import { InterviewStatus } from '@/types';

export default function InterviewPage() {
    const router = useRouter();
    const { session, pauseInterview, resumeInterview, endInterview: endInterviewStore } = useInterviewStore();
    const { isLoading, error, startInterview, processAnswer, endInterview } = useInterview();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Load session from localStorage on client mount (after hydration)
    // Then initialize interview if needed
    useEffect(() => {
        const store = useInterviewStore.getState();
        store.loadFromLocalStorage();

        // Check if we need to call the API (no interview ID yet means API wasn't called)
        const currentSession = store.session;
        if (!currentSession.id && currentSession.status === InterviewStatus.IN_PROGRESS) {
            // We have a fresh session from the home page, call the API
            startInterview(currentSession.config);
        }
    }, [startInterview]);

    // Track time elapsed
    useEffect(() => {
        if (session.status === InterviewStatus.IN_PROGRESS) {
            const interval = setInterval(() => {
                if (session.startTime) {
                    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
                    setTimeElapsed(elapsed);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [session.status, session.startTime]);

    // Trigger speaking when currentQuestion changes
    useEffect(() => {
        if (session.currentQuestion && session.status === InterviewStatus.IN_PROGRESS) {
            setIsSpeaking(true);
        }
    }, [session.currentQuestion, session.status]);

    const handleTranscriptReady = async (transcript: string) => {
        try {
            await processAnswer(transcript);
        } catch (err) {
            console.error('Failed to process answer:', err);
        }
    };

    const handlePause = () => {
        pauseInterview();
        setIsPaused(true);
    };

    const handleResume = () => {
        resumeInterview();
        setIsPaused(false);
    };

    const handleEnd = () => {
        endInterview();
        router.push('/summary');
    };

    const handleSpeakingComplete = () => {
        setIsSpeaking(false);
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                {/* Header */}
                <div className="border-b border-gray-800 bg-black/40 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Go back to home"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-500">
                                    AI Interview Session
                                </h1>
                                <p className="text-xs text-gray-500 font-mono">
                                    {session.config.role} • {session.config.difficulty}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <InterviewControls
                                onPause={handlePause}
                                onResume={handleResume}
                                onEnd={handleEnd}
                                isPaused={isPaused}
                                isProcessing={isLoading}
                            />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-400">Live</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="max-w-7xl mx-auto px-6 py-4 animate-slide-in">
                        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-red-300 mb-1">Error</h4>
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && session.status === InterviewStatus.NOT_STARTED && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                <p className="text-gray-300 font-medium">Initializing interview...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* Avatar Section */}
                        <div className="space-y-4 animate-slide-in">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-300">AI Interviewer</h2>
                                {isSpeaking && (
                                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                                            <div className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
                                        </div>
                                        <span>Speaking...</span>
                                    </div>
                                )}
                            </div>

                            {session.currentQuestion ? (
                                <AnimatedAvatar
                                    isSpeaking={isSpeaking}
                                    currentText={session.currentQuestion}
                                    onSpeakingComplete={handleSpeakingComplete}
                                />
                            ) : (
                                <LoadingSkeleton type="avatar" />
                            )}

                            {/* Current Question Display */}
                            {session.currentQuestion ? (
                                <div className="p-4 bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-blue-700/30 rounded-xl animate-slide-up">
                                    <p className="text-sm text-gray-400 mb-1 font-mono">Current Question:</p>
                                    <p className="text-white">{session.currentQuestion}</p>
                                </div>
                            ) : (
                                <LoadingSkeleton type="question" />
                            )}
                        </div>

                        {/* Candidate Section */}
                        <div className="space-y-4 animate-slide-in">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-300">Your Video</h2>
                                <ProgressIndicator
                                    questionsAnswered={session.questionsAnswered}
                                    timeElapsed={timeElapsed}
                                    estimatedTotal={10}
                                />
                            </div>
                            <WebcamCapture
                                onTranscriptReady={handleTranscriptReady}
                                isProcessing={isLoading}
                                disabled={isPaused}
                            />
                        </div>
                    </div>

                    {/* Conversation History */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 animate-slide-up">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
                            Conversation History
                        </h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {session.conversationHistory.length === 0 ? (
                                <LoadingSkeleton type="conversation" />
                            ) : (
                                session.conversationHistory.map((entry, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg transition-all ${entry.speaker === 'AI'
                                            ? 'bg-blue-900/20 border border-blue-800/30'
                                            : 'bg-emerald-900/20 border border-emerald-800/30'
                                            }`}
                                    >
                                        <p className="text-xs font-semibold mb-1 text-gray-400">
                                            {entry.speaker}
                                        </p>
                                        <p className="text-sm text-gray-200">{entry.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions Footer */}
                <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md border border-gray-700 rounded-lg p-4 max-w-sm animate-slide-up">
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">Instructions:</h4>
                    <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Listen to the AI interviewer's question</li>
                        <li>• Click "Start Answer" to record your response</li>
                        <li>• Click "Stop & Submit" when you're done</li>
                        <li>• Wait for the AI to process and ask the next question</li>
                    </ul>
                </div>
            </div>
        </ErrorBoundary >
    );
}
