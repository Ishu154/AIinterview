/**
 * Custom Hook: useSpeech
 * Manages text-to-speech with Web Speech API
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useInterviewStore } from '@/store/interviewStore';

export function useSpeech() {
    const { settings } = useInterviewStore();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    // Load voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();

        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    /**
     * Select the best voice for speaking
     */
    const selectVoice = useCallback((): SpeechSynthesisVoice | null => {
        if (voices.length === 0) return null;

        // Prefer Google voices, then Microsoft, then any English voice
        const googleVoice = voices.find(v =>
            v.name.includes('Google') && v.lang.startsWith('en')
        );
        if (googleVoice) return googleVoice;

        const microsoftVoice = voices.find(v =>
            v.name.includes('Microsoft') && v.lang.startsWith('en')
        );
        if (microsoftVoice) return microsoftVoice;

        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) return englishVoice;

        return voices[0];
    }, [voices]);

    /**
     * Speak text using TTS
     */
    const speak = useCallback((text: string, onComplete?: () => void) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        if (!text || text.trim() === '') return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = settings.speechRate;
        utterance.volume = settings.volume;
        utterance.pitch = 1;

        const voice = selectVoice();
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            if (onComplete) onComplete();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [settings, selectVoice]);

    /**
     * Stop speaking
     */
    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, []);

    /**
     * Pause speaking
     */
    const pause = useCallback(() => {
        if (isSpeaking && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    }, [isSpeaking, isPaused]);

    /**
     * Resume speaking
     */
    const resume = useCallback(() => {
        if (isSpeaking && isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    }, [isSpeaking, isPaused]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return {
        isSpeaking,
        isPaused,
        speak,
        stop,
        pause,
        resume,
        voices,
    };
}
