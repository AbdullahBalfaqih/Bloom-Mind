import * as SQLite from 'expo-sqlite';

export async function getDb() {
  const db = await SQLite.openDatabaseAsync('bloommind.db');
  await initDb(db);
  return db;
}

async function initDb(db: SQLite.SQLiteDatabase) {
  // Create sessions table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_name TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      focus_score INTEGER,
      date TEXT NOT NULL
    );
  `);

  // Create garden table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS garden (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plant_name TEXT NOT NULL,
      growth_stage TEXT NOT NULL, -- e.g., 'seed', 'sprout', 'fruiting'
      water_level INTEGER NOT NULL DEFAULT 3,
      sunlight_level INTEGER NOT NULL DEFAULT 3,
      created_at TEXT NOT NULL,
      last_watered TEXT NOT NULL
    );
  `);
}

export async function logSession(appName: string, duration: number, score: number) {
  const db = await getDb();
  const date = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO sessions (app_name, duration_minutes, focus_score, date) VALUES (?, ?, ?, ?)',
    appName,
    duration,
    score,
    date
  );
}

export async function getSessions() {
  const db = await getDb();
  return await db.getAllAsync('SELECT * FROM sessions ORDER BY date DESC');
}
