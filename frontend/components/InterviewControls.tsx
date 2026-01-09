/**
 * Interview Controls Component
 * Provides controls for pausing, resuming, and ending the interview
 */

'use client';

import React from 'react';
import { InterviewControlsProps } from '@/types';
import { Pause, Play, XCircle } from 'lucide-react';

export default function InterviewControls({
    onPause,
    onResume,
    onEnd,
    isPaused,
    isProcessing,
}: InterviewControlsProps) {

    return (
        <div className="flex items-center gap-2">
            {/* Pause/Resume Button */}
            {!isPaused ? (
                <button
                    onClick={onPause}
                    disabled={isProcessing}
                    className="p-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 text-yellow-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Pause Interview"
                    aria-label="Pause Interview"
                >
                    <Pause className="w-5 h-5" />
                </button>
            ) : (
                <button
                    onClick={onResume}
                    className="p-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 rounded-lg transition-all animate-pulse"
                    title="Resume Interview"
                    aria-label="Resume Interview"
                >
                    <Play className="w-5 h-5" />
                </button>
            )}

            {/* End Interview Button */}
            <button
                onClick={onEnd}
                disabled={isProcessing}
                className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="End Interview"
                aria-label="End Interview"
            >
                <XCircle className="w-5 h-5" />
            </button>
        </div>
    );
}
