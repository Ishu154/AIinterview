/**
 * TypeScript type definitions for the AI Video Interviewer application
 */

// ============================================================================
// Enums
// ============================================================================

export enum InterviewRole {
    FRONTEND = 'Frontend Developer',
    BACKEND = 'Backend Developer',
    FULLSTACK = 'Full Stack Developer',
    DEVOPS = 'DevOps Engineer',
    MOBILE = 'Mobile Developer',
    DATA = 'Data Engineer',
}

export enum DifficultyLevel {
    JUNIOR = 'Junior',
    MID = 'Mid Level',
    SENIOR = 'Senior',
}

export enum InterviewStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    ERROR = 'error',
}

export enum RecordingState {
    IDLE = 'idle',
    RECORDING = 'recording',
    PROCESSING = 'processing',
    ERROR = 'error',
}

// ============================================================================
// API Types
// ============================================================================

export interface StartInterviewRequest {
    role?: InterviewRole;
    difficulty?: DifficultyLevel;
    duration?: number; // in minutes
}

export interface StartInterviewResponse {
    interviewId: string;
    message: string;
    firstQuestion: string;
}

export interface TranscribeAudioRequest {
    interviewId: string;
    audio: Blob;
}

export interface TranscribeAudioResponse {
    transcript: string;
    confidence?: number;
}

export interface ProcessAnswerRequest {
    interviewId: string;
    transcript: string;
}

export interface ProcessAnswerResponse {
    transcript: string;
    nextQuestion: string;
    isComplete?: boolean;
}

export interface APIError {
    error: string;
    code?: string;
    details?: any;
}

// ============================================================================
// Interview Types
// ============================================================================

export interface ConversationEntry {
    speaker: 'AI' | 'You';
    text: string;
    timestamp: number;
}

export interface InterviewConfig {
    role: InterviewRole;
    difficulty: DifficultyLevel;
    duration: number; // in minutes
}

export interface InterviewSession {
    id: string | null;
    config: InterviewConfig;
    status: InterviewStatus;
    conversationHistory: ConversationEntry[];
    currentQuestion: string;
    startTime: number | null;
    endTime: number | null;
    questionsAnswered: number;
}

export interface InterviewSettings {
    volume: number; // 0-1
    speechRate: number; // 0.5-2
    autoPlayQuestions: boolean;
    showTranscript: boolean;
}

// ============================================================================
// Component Props
// ============================================================================

export interface AvatarPlayerProps {
    isSpeaking: boolean;
    currentText: string;
    onSpeakingComplete?: () => void;
}

export interface WebcamCaptureProps {
    onAudioRecorded: (audioBlob: Blob) => void;
    isProcessing: boolean;
    disabled?: boolean;
}

export interface InterviewControlsProps {
    onPause: () => void;
    onResume: () => void;
    onEnd: () => void;
    isPaused: boolean;
    isProcessing: boolean;
}

export interface ProgressIndicatorProps {
    questionsAnswered: number;
    timeElapsed: number; // in seconds
    estimatedTotal?: number;
}

export interface LoadingSkeletonProps {
    type: 'avatar' | 'question' | 'conversation';
}

// ============================================================================
// Store Types
// ============================================================================

export interface InterviewStore {
    session: InterviewSession;
    settings: InterviewSettings;

    // Actions
    startInterview: (config: InterviewConfig) => void;
    updateSession: (updates: Partial<InterviewSession>) => void;
    addConversationEntry: (entry: ConversationEntry) => void;
    pauseInterview: () => void;
    resumeInterview: () => void;
    endInterview: () => void;
    resetInterview: () => void;
    updateSettings: (settings: Partial<InterviewSettings>) => void;

    // Persistence
    saveToLocalStorage: () => void;
    loadFromLocalStorage: () => void;
    clearLocalStorage: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface ExportOptions {
    format: 'pdf' | 'json';
    includeTimestamps?: boolean;
    includeMetadata?: boolean;
}

export interface SampleQuestion {
    role: InterviewRole;
    difficulty: DifficultyLevel;
    question: string;
    category: string;
}
