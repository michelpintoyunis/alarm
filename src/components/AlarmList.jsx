import React from 'react';
import { Trash2, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export function AlarmList({ alarms, onToggle, onDelete, onEdit }) {
    if (alarms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <p>No alarms set</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 w-full max-w-md mx-auto p-4">
            {alarms.map(alarm => (
                <div key={alarm.id} className={cn(
                    "flex items-center justify-between p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all",
                    !alarm.enabled && "opacity-50 grayscale"
                )}>
                    <div className="flex flex-col cursor-pointer" onClick={() => onEdit && onEdit(alarm)}>
                        <span className="text-4xl font-bold tabular-nums">
                            {alarm.time}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {alarm.label || 'Alarm'}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onToggle(alarm.id)}
                            className="text-primary hover:text-primary/80 transition-colors"
                        >
                            {alarm.enabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                        </button>
                        <button
                            onClick={() => onDelete(alarm.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                        >
                            <Trash2 size={24} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
