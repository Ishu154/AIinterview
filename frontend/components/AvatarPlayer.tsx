/**
 * AnimatedAvatar Component
 * Enhanced with useSpeech hook and better animations
 */

'use client';

import React, { useEffect } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { AvatarPlayerProps } from '@/types';

export default function AnimatedAvatar({ isSpeaking, currentText, onSpeakingComplete }: AvatarPlayerProps) {
    const { speak, stop, isSpeaking: isActuallySpeaking } = useSpeech();

    useEffect(() => {
        if (isSpeaking && currentText) {
            speak(currentText, onSpeakingComplete);
        } else if (!isSpeaking) {
            stop();
        }

        return () => stop();
    }, [isSpeaking, currentText]);

    const showSpeaking = isSpeaking || isActuallySpeaking;

    return (
        <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Fallback animated avatar */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="relative">
                    {/* Outer pulsing rings */}
                    {showSpeaking && (
                        <>
                            <div className="absolute inset-0 -m-8 border-4 border-blue-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 -m-12 border-4 border-emerald-500/20 rounded-full animate-ping delay-75"></div>
                        </>
                    )}

                    {/* Main Avatar Circle */}
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-2xl transition-all duration-300 ${showSpeaking ? 'scale-110' : 'scale-100'
                        }`}>
                        {/* AI Icon */}
                        <svg
                            className="w-16 h-16 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    </div>

                    {/* Animated sound waves */}
                    {showSpeaking && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
                            <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse delay-75"></div>
                            <div className="w-1 h-8 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                            <div className="w-1 h-6 bg-emerald-400 rounded-full animate-pulse delay-200"></div>
                            <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Speaking Indicator Overlay */}
            {showSpeaking && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full z-10 animate-slide-in">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs text-white font-semibold">Speaking</span>
                </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${showSpeaking
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${showSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
                        }`}></div>
                    {showSpeaking ? 'Active' : 'Ready'}
                </div>
            </div>

            {/* AI Label */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-gray-600/30">
                    <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        AI Interviewer
                    </p>
                </div>
            </div>
        </div>
    );
}

