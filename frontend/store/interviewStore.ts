/**
 * Zustand Store for Global Interview State
 * Provides centralized state management with localStorage persistence
 */

import { create } from 'zustand';
import {
    InterviewStore,
    InterviewSession,
    InterviewSettings,
    InterviewConfig,
    InterviewStatus,
    ConversationEntry,
    InterviewRole,
    DifficultyLevel,
} from '@/types';

const STORAGE_KEY = 'ai-interview-session';

// Default configuration
const defaultConfig: InterviewConfig = {
    role: InterviewRole.FULLSTACK,
    difficulty: DifficultyLevel.MID,
    duration: 30,
};

// Default settings
const defaultSettings: InterviewSettings = {
    volume: 0.8,
    speechRate: 0.9,
    autoPlayQuestions: true,
    showTranscript: true,
};

// Default session
const defaultSession: InterviewSession = {
    id: null,
    config: defaultConfig,
    status: InterviewStatus.NOT_STARTED,
    conversationHistory: [],
    currentQuestion: '',
    startTime: null,
    endTime: null,
    questionsAnswered: 0,
};

/**
 * Load session from localStorage
 */
const loadSession = (): InterviewSession => {
    if (typeof window === 'undefined') return defaultSession;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Only load if the session is in progress or paused
            if (parsed.status === InterviewStatus.IN_PROGRESS || parsed.status === InterviewStatus.PAUSED) {
                return parsed;
            }
        }
    } catch (error) {
        console.error('Failed to load session from localStorage:', error);
    }

    return defaultSession;
};

/**
 * Save session to localStorage
 */
const saveSession = (session: InterviewSession): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
        console.error('Failed to save session to localStorage:', error);
    }
};

/**
 * Clear session from localStorage
 */
const clearSession = (): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear session from localStorage:', error);
    }
};

/**
 * Interview Store
 * Note: Always initialize with defaultSession to avoid hydration mismatches.
 * Call loadFromLocalStorage() in a useEffect on the client to restore saved sessions.
 */
export const useInterviewStore = create<InterviewStore>((set, get) => ({
    session: defaultSession, // Always start with default to avoid SSR hydration mismatch
    settings: defaultSettings,

    startInterview: (config: InterviewConfig) => {
        const session: InterviewSession = {
            id: null, // Will be set from API
            config,
            status: InterviewStatus.IN_PROGRESS,
            conversationHistory: [],
            currentQuestion: '',
            startTime: Date.now(),
            endTime: null,
            questionsAnswered: 0,
        };

        set({ session });
        saveSession(session);
    },

    updateSession: (updates: Partial<InterviewSession>) => {
        const currentSession = get().session;
        const newSession = { ...currentSession, ...updates };

        set({ session: newSession });
        saveSession(newSession);
    },

    addConversationEntry: (entry: ConversationEntry) => {
        const currentSession = get().session;
        const newSession = {
            ...currentSession,
            conversationHistory: [...currentSession.conversationHistory, entry],
            questionsAnswered: entry.speaker === 'You'
                ? currentSession.questionsAnswered + 1
                : currentSession.questionsAnswered,
        };

        set({ session: newSession });
        saveSession(newSession);
    },

    pauseInterview: () => {
        const currentSession = get().session;
        const newSession = {
            ...currentSession,
            status: InterviewStatus.PAUSED,
        };

        set({ session: newSession });
        saveSession(newSession);
    },

    resumeInterview: () => {
        const currentSession = get().session;
        const newSession = {
            ...currentSession,
            status: InterviewStatus.IN_PROGRESS,
        };

        set({ session: newSession });
        saveSession(newSession);
    },

    endInterview: () => {
        const currentSession = get().session;
        const newSession = {
            ...currentSession,
            status: InterviewStatus.COMPLETED,
            endTime: Date.now(),
        };

        set({ session: newSession });
        saveSession(newSession);
    },

    resetInterview: () => {
        set({ session: defaultSession });
        clearSession();
    },

    updateSettings: (newSettings: Partial<InterviewSettings>) => {
        const currentSettings = get().settings;
        set({ settings: { ...currentSettings, ...newSettings } });
    },

    saveToLocalStorage: () => {
        const session = get().session;
        saveSession(session);
    },

    loadFromLocalStorage: () => {
        const session = loadSession();
        set({ session });
    },

    clearLocalStorage: () => {
        clearSession();
        set({ session: defaultSession });
    },
}));
