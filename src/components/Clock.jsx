import React from 'react';
import { useTime } from '../hooks/useTime';

export function Clock() {
    const time = useTime();

    // Format: HH:mm:ss
    const timeString = time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    // Date: Monday, January 1
    const dateString = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <h1 className="text-8xl font-bold tracking-tighter tabular-nums text-foreground">
                {timeString}
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
                {dateString}
            </p>
        </div>
    );
}
