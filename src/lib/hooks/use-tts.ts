import { useState, useEffect, useCallback } from 'react';

interface UseTTSProps {
    text: string;
    onEnd?: () => void;
}

export function useTextToSpeech({ text, onEnd }: UseTTSProps) {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const u = new SpeechSynthesisUtterance(text);

        // Select a good voice (prefer Google US English or similar)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (preferredVoice) u.voice = preferredVoice;

        u.rate = 0.9; // Slightly slower for storytelling vibe
        u.pitch = 1;

        u.onstart = () => setIsSpeaking(true);
        u.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            if (onEnd) onEnd();
        };
        u.onpause = () => setIsPaused(true);
        u.onresume = () => setIsPaused(false);

        setUtterance(u);

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [text, onEnd]);

    const speak = useCallback(() => {
        if (!utterance) return;
        window.speechSynthesis.cancel(); // Stop any previous speech
        window.speechSynthesis.speak(utterance);
    }, [utterance]);

    const pause = useCallback(() => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
        }
    }, []);

    const resume = useCallback(() => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }, []);

    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, []);

    const toggle = useCallback(() => {
        if (isSpeaking) {
            cancel();
        } else {
            speak();
        }
    }, [isSpeaking, cancel, speak]);

    return { isSpeaking, isPaused, speak, pause, resume, cancel, toggle };
}
