/**
 * Custom Hook: useInterview
 * Manages interview session state and API interactions
 */

import { useState, useCallback } from 'react';
import { useInterviewStore } from '@/store/interviewStore';
import * as api from '@/lib/api';
import { InterviewConfig, ConversationEntry } from '@/types';
import toast from 'react-hot-toast';

export function useInterview() {
    const {
        session,
        startInterview: startInterviewStore,
        updateSession,
        addConversationEntry,
        endInterview: endInterviewStore,
    } = useInterviewStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Start a new interview session
     */
    const startInterview = useCallback(async (config: InterviewConfig) => {
        setIsLoading(true);
        setError(null);

        try {
            // Initialize store
            startInterviewStore(config);

            // Call API to start interview
            const response = await api.startInterview({
                role: config.role,
                difficulty: config.difficulty,
                duration: config.duration,
            });

            // Update session with interview ID and first question
            updateSession({
                id: response.interviewId,
                currentQuestion: response.firstQuestion,
            });

            // Add first question to history
            const entry: ConversationEntry = {
                speaker: 'AI',
                text: response.firstQuestion,
                timestamp: Date.now(),
            };
            addConversationEntry(entry);

            toast.success('Interview started!');
            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to start interview';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [startInterviewStore, updateSession, addConversationEntry]);

    /**
     * Process answer text and get next question
     * Now accepts transcript directly (from browser speech recognition)
     */
    const processAnswer = useCallback(async (transcript: string) => {
        if (!session.id) {
            const error = 'No active interview session';
            setError(error);
            toast.error(error);
            return;
        }

        if (!transcript.trim()) {
            const error = 'No speech detected. Please try again.';
            setError(error);
            toast.error(error);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Process the transcript directly (no more audio transcription needed!)
            const response = await api.processAnswer({
                interviewId: session.id,
                transcript: transcript.trim(),
            });

            // Add user's answer to history
            const userEntry: ConversationEntry = {
                speaker: 'You',
                text: transcript.trim(),
                timestamp: Date.now(),
            };
            addConversationEntry(userEntry);

            // Add AI's next question to history
            const aiEntry: ConversationEntry = {
                speaker: 'AI',
                text: response.nextQuestion,
                timestamp: Date.now(),
            };
            addConversationEntry(aiEntry);

            // Update current question
            updateSession({
                currentQuestion: response.nextQuestion,
            });

            return response;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to process answer';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [session.id, addConversationEntry, updateSession]);

    /**
     * End the interview
     */
    const endInterview = useCallback(() => {
        endInterviewStore();
        toast.success('Interview completed!');
    }, [endInterviewStore]);

    /**
     * Retry last failed operation
     */
    const retry = useCallback(async (transcript?: string) => {
        setError(null);
        if (transcript && session.id) {
            return processAnswer(transcript);
        }
    }, [session.id, processAnswer]);

    return {
        session,
        isLoading,
        error,
        startInterview,
        processAnswer,
        endInterview,
        retry,
    };
}
