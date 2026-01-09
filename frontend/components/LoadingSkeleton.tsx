/**
 * Loading Skeleton Component
 * Provides skeleton loaders for different content types
 */

'use client';

import React from 'react';
import { LoadingSkeletonProps } from '@/types';

export default function LoadingSkeleton({ type }: LoadingSkeletonProps) {
    if (type === 'avatar') {
        return (
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <div className="w-32 h-32 rounded-full bg-gray-800"></div>
                </div>
            </div>
        );
    }

    if (type === 'question') {
        return (
            <div className="p-4 bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-blue-700/30 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            </div>
        );
    }

    if (type === 'conversation') {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30 animate-pulse">
                        <div className="h-3 bg-gray-700 rounded w-1/6 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
}
