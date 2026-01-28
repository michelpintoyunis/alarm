import { openDB } from 'idb';

const DB_NAME = 'alarm-db';
const DB_VERSION = 1;
const STORE_NAME = 'alarms';

export async function initDB() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
}

export async function getAlarms() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

export async function saveAlarm(alarm) {
    const db = await initDB();
    return db.put(STORE_NAME, alarm);
}

export async function deleteAlarm(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
}
