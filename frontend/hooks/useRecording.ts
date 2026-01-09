/**
 * Custom Hook: useRecording
 * Manages audio recording with MediaRecorder API
 */

import { useState, useCallback, useRef } from 'react';
import { RecordingState } from '@/types';
import toast from 'react-hot-toast';

const MAX_RECORDING_DURATION = 180000; // 3 minutes in ms

export function useRecording() {
    const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.IDLE);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Start recording audio
     */
    const startRecording = useCallback(async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create media recorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm',
            });

            chunksRef.current = [];

            // Handle data available event
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // Handle stop event
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setRecordingState(RecordingState.IDLE);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());

                // Clear timers
                if (timerRef.current) clearTimeout(timerRef.current);
                if (durationTimerRef.current) clearInterval(durationTimerRef.current);
            };

            // Start recording
            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setRecordingState(RecordingState.RECORDING);
            setRecordingDuration(0);

            // Start duration timer
            const startTime = Date.now();
            durationTimerRef.current = setInterval(() => {
                setRecordingDuration(Date.now() - startTime);
            }, 100);

            // Auto-stop after max duration
            timerRef.current = setTimeout(() => {
                stopRecording();
                toast.error('Maximum recording duration reached');
            }, MAX_RECORDING_DURATION);

            toast.success('Recording started');
        } catch (error: any) {
            console.error('Failed to start recording:', error);
            setRecordingState(RecordingState.ERROR);

            if (error.name === 'NotAllowedError') {
                toast.error('Microphone permission denied');
            } else if (error.name === 'NotFoundError') {
                toast.error('No microphone found');
            } else {
                toast.error('Failed to start recording');
            }
        }
    }, []);

    /**
     * Stop recording audio
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState === RecordingState.RECORDING) {
            mediaRecorderRef.current.stop();

            if (timerRef.current) clearTimeout(timerRef.current);
            if (durationTimerRef.current) clearInterval(durationTimerRef.current);

            toast.success('Recording stopped');
        }
    }, [recordingState]);

    /**
     * Cancel recording without saving
     */
    const cancelRecording = useCallback(() => {
        if (mediaRecorderRef.current && recordingState === RecordingState.RECORDING) {
            mediaRecorderRef.current.stop();
            chunksRef.current = [];
            setAudioBlob(null);

            if (timerRef.current) clearTimeout(timerRef.current);
            if (durationTimerRef.current) clearInterval(durationTimerRef.current);

            setRecordingState(RecordingState.IDLE);
            toast('Recording cancelled', { icon: '⚠️' });
        }
    }, [recordingState]);

    /**
     * Reset recording state
     */
    const reset = useCallback(() => {
        setRecordingState(RecordingState.IDLE);
        setRecordingDuration(0);
        setAudioBlob(null);
        chunksRef.current = [];
    }, []);

    return {
        recordingState,
        recordingDuration,
        audioBlob,
        startRecording,
        stopRecording,
        cancelRecording,
        reset,
        isRecording: recordingState === RecordingState.RECORDING,
        isProcessing: recordingState === RecordingState.PROCESSING,
    };
}
