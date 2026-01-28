import { useRef, useEffect } from 'react';

export function useAudio() {
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);

    useEffect(() => {
        // Initialize AudioContext on user interaction if needed, usually best done lazily
        return () => stop();
    }, []);

    const play = () => {
        stop(); // Ensure any previous sound is stopped

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine'; // simple beep
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4

        // Pulse effect
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setTargetAtTime(440, ctx.currentTime + 0.1, 0.1);

        // Volume envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        oscillatorRef.current = osc;

        // Loop the beep
        const loopInterval = setInterval(() => {
            // We can trigger another beep here if we want a repeating alarm pattern
            // But simpler to just let the oscillator run if we want continuous tone, 
            // For a beep-beep-beep we need to schedule it.
            scheduleBeep(ctx);
        }, 1000);

        osc.stop(ctx.currentTime + 0.6); // Stop initial beep

        // Helper to schedule beeps
        const scheduleBeep = (context) => {
            if (context.state === 'closed') return;
            const o = context.createOscillator();
            const g = context.createGain();
            o.type = 'square';
            o.frequency.value = 880;

            o.connect(g);
            g.connect(context.destination);

            const now = context.currentTime;
            g.gain.setValueAtTime(0, now);
            g.gain.linearRampToValueAtTime(0.3, now + 0.05);
            g.gain.linearRampToValueAtTime(0, now + 0.2);

            o.start(now);
            o.stop(now + 0.3);
        };

        // Store interval to clear
        osc.onended = () => {
            // This only fires when the specific oscillator node ends
        };

        // Actually, let's keep it simple: An infinite loop of beeps
        // We need to return a cleanup function or handle state
        audioContextRef.current.loopId = loopInterval;
    };

    const stop = () => {
        if (audioContextRef.current) {
            if (audioContextRef.current.loopId) {
                clearInterval(audioContextRef.current.loopId);
            }
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    return { play, stop };
}
