import { useState, useEffect } from 'react';
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

    async function addAlarm(alarm) {
        const newAlarm = { ...alarm, id: Date.now(), enabled: true };
        await saveAlarm(newAlarm);
        setAlarms(prev => [...prev, newAlarm]);
    }

    async function updateAlarm(updatedAlarm) {
        await saveAlarm(updatedAlarm);
        setAlarms(prev => prev.map(a => a.id === updatedAlarm.id ? updatedAlarm : a));
    }

    async function removeAlarm(id) {
        await deleteAlarm(id);
        setAlarms(prev => prev.filter(a => a.id !== id));
    }

    async function toggleAlarm(id) {
        const alarm = alarms.find(a => a.id === id);
        if (alarm) {
            await updateAlarm({ ...alarm, enabled: !alarm.enabled });
        }
    }

    return { alarms, loading, addAlarm, updateAlarm, removeAlarm, toggleAlarm };
}
