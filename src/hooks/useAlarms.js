import { useState, useEffect, useCallback } from 'react';
import { getAlarms, saveAlarm, deleteAlarm } from '../db';

export function useAlarms() {
    const [alarms, setAlarms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAlarms();
    }, []);

    async function loadAlarms() {
        try {
            const data = await getAlarms();
            setAlarms(data);
        } catch (error) {
            console.error("Failed to load alarms", error);
        } finally {
            setLoading(false);
        }
    }

    const addAlarm = useCallback(async (alarm) => {
        const newAlarm = { ...alarm, id: Date.now(), enabled: true };
        await saveAlarm(newAlarm);
        setAlarms(prev => [...prev, newAlarm]);
    }, []);

    const updateAlarm = useCallback(async (updatedAlarm) => {
        await saveAlarm(updatedAlarm);
        setAlarms(prev => prev.map(a => a.id === updatedAlarm.id ? updatedAlarm : a));
    }, []);

    const removeAlarm = useCallback(async (id) => {
        await deleteAlarm(id);
        setAlarms(prev => prev.filter(a => a.id !== id));
    }, []);

    const toggleAlarm = useCallback(async (id) => {
        setAlarms(prev => {
            const alarm = prev.find(a => a.id === id);
            if (alarm) {
                const updated = { ...alarm, enabled: !alarm.enabled };
                saveAlarm(updated); // Side effect inside setter is not ideal but works for async persistence trigger
                return prev.map(a => a.id === id ? updated : a);
            }
            return prev;
        });
    }, []);

    return { alarms, loading, addAlarm, updateAlarm, removeAlarm, toggleAlarm };
}
