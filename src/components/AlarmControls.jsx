import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export function AlarmControls({ alarmToEdit, onSave, onCancel }) {
    const [time, setTime] = useState('07:00');
    const [label, setLabel] = useState('');

    useEffect(() => {
        if (alarmToEdit) {
            setTime(alarmToEdit.time);
            setLabel(alarmToEdit.label || '');
        } else {
            setTime('07:00');
            setLabel('');
        }
    }, [alarmToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...alarmToEdit,
            time,
            label
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center">
                    {alarmToEdit ? 'Edit Alarm' : 'Add Alarm'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="text-6xl bg-transparent border-b-2 border-border focus:border-primary outline-none text-center w-full p-2 font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Label</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="Morning Alarm"
                            className="w-full bg-secondary/50 rounded-lg p-3 outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 flex items-center justify-center p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors font-medium"
                        >
                            <X className="mr-2" /> Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center p-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-bold"
                        >
                            <Check className="mr-2" /> Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
