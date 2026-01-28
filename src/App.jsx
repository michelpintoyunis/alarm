import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Clock } from './components/Clock';
import { AlarmList } from './components/AlarmList';
import { AlarmControls } from './components/AlarmControls';
import { useAlarms } from './hooks/useAlarms';
import { useTime } from './hooks/useTime';
import { useAudio } from './hooks/useAudio';

function App() {
  const { alarms, addAlarm, updateAlarm, removeAlarm, toggleAlarm } = useAlarms();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [ringingAlarm, setRingingAlarm] = useState(null);

  const currentTime = useTime();
  const audio = useAudio();

  // Check for alarm triggers
  const [dismissedTime, setDismissedTime] = useState(null);

  useEffect(() => {
    const nowString = currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Reset dismissed state if critical minute has passed
    if (dismissedTime && dismissedTime !== nowString) {
      setDismissedTime(null);
    }

    if (ringingAlarm) return;
    if (dismissedTime === nowString) return; // Prevent re-triggering in the same minute

    const match = alarms.find(a => a.enabled && a.time === nowString);
    if (match) {
      setRingingAlarm(match);
      audio.play();

      // Send notification
      if (Notification.permission === 'granted') {
        new Notification('Alarm', {
          body: match.label || 'Time to wake up!',
          icon: '/pwa-192x192.png',
          requireInteraction: true,
          vibrate: [200, 100, 200]
        });
      }
    }
  }, [currentTime, alarms, ringingAlarm, audio, dismissedTime]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleSave = (alarm) => {
    if (alarm.id) {
      updateAlarm(alarm);
    } else {
      addAlarm(alarm);
    }
    setIsEditing(false);
    setEditingAlarm(null);
  };

  const handleDismiss = () => {
    setRingingAlarm(null);
    audio.stop();
    // Record that we dismissed the alarm for this specific time
    const nowString = currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    setDismissedTime(nowString);
  };

  const handleSnooze = () => {
    handleDismiss();
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Today Alarm
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center max-w-lg mx-auto w-full pb-20">
        <Clock />

        <div className="w-full px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Alarms</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-secondary p-2 rounded-full hover:bg-secondary/80 transition-colors"
            >
              <Plus size={24} />
            </button>
          </div>
          <AlarmList
            alarms={alarms}
            onToggle={toggleAlarm}
            onDelete={removeAlarm}
            onEdit={(a) => {
              setEditingAlarm(a);
              setIsEditing(true);
            }}
          />
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isEditing && (
        <AlarmControls
          alarmToEdit={editingAlarm}
          onSave={handleSave}
          onCancel={() => {
            setIsEditing(false);
            setEditingAlarm(null);
          }}
        />
      )}

      {/* Ringing Overlay */}
      {ringingAlarm && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
          <div className="animate-pulse mb-8">
            <Clock />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">{ringingAlarm.label || 'Alarm'}</h2>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
              onClick={handleDismiss}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-red-500/20 transform hover:scale-105 transition-all"
            >
              Stop
            </button>
            <button
              onClick={handleSnooze}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-lg font-medium"
            >
              Snooze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
