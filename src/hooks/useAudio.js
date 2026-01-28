import { useRef, useEffect, useCallback, useMemo } from 'react';

export function useAudio() {
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);

    // Define stop first so it can be used in useEffect and play
    const stop = useCallback(() => {
        if (audioContextRef.current) {
            if (audioContextRef.current.loopId) {
                clearInterval(audioContextRef.current.loopId);
            }
            // Check state before closing to avoid errors
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(e => console.error(e));
            }
            audioContextRef.current = null;
        }
    }, []);

    useEffect(() => {
        // Initialize AudioContext on user interaction if needed, usually best done lazily
        return () => stop();
    }, [stop]);

    const play = useCallback(() => {
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

        audioContextRef.current.loopId = loopInterval;
    }, [stop]);

    return useMemo(() => ({ play, stop }), [play, stop]);
}
