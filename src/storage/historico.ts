import * as SQLite from 'expo-sqlite';

export type RegistroHistorico = {
  id: number;
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  tocadoEm: string;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('historico.db').then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS historico (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trackId INTEGER NOT NULL,
          trackName TEXT NOT NULL,
          artistName TEXT NOT NULL,
          artworkUrl100 TEXT,
          tocadoEm TEXT NOT NULL
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

export async function registrarReproducao(musica: {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
}) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO historico (trackId, trackName, artistName, artworkUrl100, tocadoEm) VALUES (?, ?, ?, ?, ?)',
    [musica.trackId, musica.trackName, musica.artistName, musica.artworkUrl100, new Date().toISOString()]
  );
}

export async function listarHistorico(ordenarPor: 'recente' | 'artista' = 'recente'): Promise<RegistroHistorico[]> {
  const db = await getDb();
  const ordem = ordenarPor === 'artista' ? 'artistName ASC, tocadoEm DESC' : 'tocadoEm DESC';
  return db.getAllAsync<RegistroHistorico>(`SELECT * FROM historico ORDER BY ${ordem}`);
}

export async function ultimaReproducao(): Promise<RegistroHistorico | null> {
  const db = await getDb();
  const linha = await db.getFirstAsync<RegistroHistorico>(
    'SELECT * FROM historico ORDER BY tocadoEm DESC LIMIT 1'
  );
  return linha ?? null;
}

export async function limparHistorico() {
  const db = await getDb();
  await db.runAsync('DELETE FROM historico');
}