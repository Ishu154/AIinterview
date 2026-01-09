/**
 * API Service Layer
 * Centralized API calls with retry logic, error handling, and type safety
 */

import {
    StartInterviewRequest,
    StartInterviewResponse,
    TranscribeAudioRequest,
    TranscribeAudioResponse,
    ProcessAnswerRequest,
    ProcessAnswerResponse,
    APIError,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

/**
 * Custom error class for API errors
 */
export class APIErrorResponse extends Error {
    code?: string;
    details?: any;

    constructor(message: string, code?: string, details?: any) {
        super(message);
        this.name = 'APIErrorResponse';
        this.code = code;
        this.details = details;
    }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Exponential backoff calculation
 */
const getBackoffDelay = (attempt: number): number => {
    return RETRY_DELAY * Math.pow(2, attempt - 1);
};

/**
 * Generic fetch wrapper with retry logic and error handling
 */
async function fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number = MAX_RETRIES
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            // Parse response
            const data = await response.json();

            // Handle error responses
            if (!response.ok) {
                throw new APIErrorResponse(
                    data.error || `Server error: ${response.status}`,
                    data.code,
                    data.details
                );
            }

            return data as T;
        } catch (error) {
            lastError = error as Error;

            // Don't retry on client errors (4xx) except 408 (timeout)
            if (error instanceof APIErrorResponse && error.message.includes('400')) {
                throw error;
            }

            // Retry with exponential backoff
            if (attempt < retries) {
                const delay = getBackoffDelay(attempt);
                console.warn(`API request failed (attempt ${attempt}/${retries}). Retrying in ${delay}ms...`);
                await sleep(delay);
            }
        }
    }

    // All retries exhausted
    throw lastError || new Error('API request failed');
}

/**
 * Start a new interview session
 */
export async function startInterview(
    request: StartInterviewRequest = {}
): Promise<StartInterviewResponse> {
    return fetchWithRetry<StartInterviewResponse>(
        `${API_BASE_URL}/api/start-interview`,
        {
            method: 'POST',
            body: JSON.stringify(request),
        }
    );
}

/**
 * Transcribe audio using Gemini
 */
export async function transcribeAudio(
    interviewId: string,
    audioBlob: Blob
): Promise<TranscribeAudioResponse> {
    const formData = new FormData();
    formData.append('interviewId', interviewId);
    formData.append('audio', audioBlob, 'recording.webm');

    // Note: FormData requests should not have Content-Type header set manually
    const response = await fetch(`${API_BASE_URL}/api/transcribe-audio`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new APIErrorResponse(
            data.error || `Transcription failed: ${response.status}`,
            data.code,
            data.details
        );
    }

    return data as TranscribeAudioResponse;
}

/**
 * Process candidate answer and get next question
 */
export async function processAnswer(
    request: ProcessAnswerRequest
): Promise<ProcessAnswerResponse> {
    return fetchWithRetry<ProcessAnswerResponse>(
        `${API_BASE_URL}/api/process-answer`,
        {
            method: 'POST',
            body: JSON.stringify(request),
        }
    );
}

/**
 * Combined: Transcribe audio and process answer in one call
 */
export async function transcribeAndProcess(
    interviewId: string,
    audioBlob: Blob
): Promise<ProcessAnswerResponse> {
    // First transcribe
    const { transcript } = await transcribeAudio(interviewId, audioBlob);

    // Then process
    return processAnswer({ interviewId, transcript });
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
        });
        return { status: response.ok ? 'ok' : 'error' };
    } catch {
        return { status: 'error' };
    }
}
