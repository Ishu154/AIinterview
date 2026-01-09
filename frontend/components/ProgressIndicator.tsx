/**
 * Progress Indicator Component
 * Shows interview progress with questions answered and time elapsed
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ProgressIndicatorProps } from '@/types';

export default function ProgressIndicator({
    questionsAnswered,
    timeElapsed,
    estimatedTotal = 10,
}: ProgressIndicatorProps) {
    const [formattedTime, setFormattedTime] = useState('0:00');

    useEffect(() => {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        setFormattedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, [timeElapsed]);

    const progress = Math.min((questionsAnswered / estimatedTotal) * 100, 100);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-300">Progress</h3>
                <span className="text-xs text-gray-500 font-mono">{formattedTime}</span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                    <span className="text-blue-400 font-semibold">{questionsAnswered}</span>
                    {' / '}
                    <span className="text-gray-500">{estimatedTotal}</span>
                    {' '}questions
                </span>
                <span className="text-gray-500">{Math.round(progress)}%</span>
            </div>
        </div>
    );
}
