import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('kindness.db');

export const initDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS kindness (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      text TEXT,
      preset_ids TEXT,
      photo_uri TEXT,
      created_at INTEGER NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_kindness_date ON kindness(date);
  `);
};

export default db;