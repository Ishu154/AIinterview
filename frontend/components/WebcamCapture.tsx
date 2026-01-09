/**
 * WebcamCapture Component
 * Uses browser's Web Speech API for FREE transcription (no API needed)
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useRecording } from '@/hooks/useRecording';
import { RecordingState } from '@/types';
import { playStartRecording, playStopRecording } from '@/lib/sounds';

interface WebcamCaptureProps {
    onTranscriptReady: (transcript: string) => void;
    isProcessing: boolean;
    disabled?: boolean;
}

export default function WebcamCapture({ onTranscriptReady, isProcessing, disabled }: WebcamCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Speech recognition for FREE transcription
    const {
        isListening,
        transcript,
        interimTranscript,
        fullTranscript,
        isSupported,
        error: speechError,
        startListening,
        stopListening,
        resetTranscript
    } = useSpeechRecognition();

    // Recording hook (for visual feedback only)
    const { recordingDuration, startRecording, stopRecording, isRecording } = useRecording();

    // Setup camera
    useEffect(() => {
        async function setupCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
            }
        }
        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleStartRecording = () => {
        playStartRecording();
        resetTranscript();
        startRecording();
        startListening();
    };

    const handleStopRecording = () => {
        playStopRecording();
        stopRecording();
        const finalTranscript = stopListening();

        // Use either the final transcript or what we have accumulated
        const textToSend = finalTranscript || transcript || fullTranscript;

        if (textToSend.trim()) {
            onTranscriptReady(textToSend.trim());
        } else {
            // If no speech detected, show a message
            console.warn('No speech detected');
        }
    };

    const formatDuration = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl shadow-xl border-2 border-gray-800 bg-black">
            {/* Video Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover transform scale-x-[-1]"
            />

            {/* Browser Support Warning */}
            {!isSupported && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                    <div className="text-center text-red-400">
                        <p className="font-semibold mb-2">Speech Recognition Not Supported</p>
                        <p className="text-sm">Please use Chrome, Edge, or Safari</p>
                    </div>
                </div>
            )}

            {/* Live Transcript Display */}
            {isRecording && fullTranscript && (
                <div className="absolute top-14 left-2 right-2 max-h-20 overflow-y-auto">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                        <p className="text-xs text-emerald-400 mb-1">Live Transcription:</p>
                        <p className="text-sm text-white">
                            {transcript}
                            <span className="text-gray-400">{interimTranscript}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Recording Timer */}
            {isRecording && !fullTranscript && (
                <div className="absolute top-14 left-2 right-2 flex justify-center">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="text-2xl font-mono text-white tabular-nums">
                            {formatDuration(recordingDuration)}
                        </p>
                    </div>
                </div>
            )}

            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                {!isRecording && !isProcessing && (
                    <button
                        onClick={handleStartRecording}
                        disabled={disabled || !isSupported}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Start recording answer"
                    >
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        Start Answer
                    </button>
                )}

                {isRecording && (
                    <button
                        onClick={handleStopRecording}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold transition-all shadow-lg flex items-center gap-2 animate-pulse"
                        aria-label="Stop recording and submit"
                    >
                        <div className="w-3 h-3 bg-white rounded-sm" />
                        Stop & Submit
                    </button>
                )}

                {isProcessing && (
                    <div className="px-6 py-3 bg-gray-700 text-gray-300 rounded-full font-mono text-sm flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                    </div>
                )}
            </div>

            {/* Recording Indicator */}
            {isRecording && (
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white font-semibold">Recording</span>
                </div>
            )}

            {/* Listening Indicator */}
            {isListening && (
                <div className="absolute top-2 right-2 flex items-center gap-2 bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white font-semibold">Listening</span>
                </div>
            )}

            {/* Waveform visualization */}
            {isRecording && (
                <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1 px-4">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-emerald-400 rounded-full animate-pulse"
                            style={{
                                height: `${Math.random() * 40 + 10}px`,
                                animationDelay: `${i * 50}ms`,
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
