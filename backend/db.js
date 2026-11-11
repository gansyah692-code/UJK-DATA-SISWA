// SQLite bawaan Node.js (butuh Node 22.5+), tidak perlu install paket tambahan.
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'siswa.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS siswa (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    kode_siswa     TEXT NOT NULL UNIQUE,
    nama           TEXT NOT NULL,
    alamat         TEXT, 
    tanggal_lahir  TEXT, 
    jurusan        TEXT NOT NULL DEFAULT '',
    created_at     TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

const infoKolom = db.prepare('PRAGMA table_info(siswa)').all();
const columns = new Set(infoKolom.map((column) => column.name));
const kolomBaru = ['kode_siswa', 'jurusan'];

if (kolomBaru.some((column) => !columns.has(column))) {
  const quote = (name) => `"${name.replaceAll('"', '""')}"`;
  const inti = new Set([
    'id',
    'kode_siswa',
    'nama',
    'alamat',
    'tanggal_lahir',
    'jurusan',
    'created_at',
  ]);
  const kolomLama = infoKolom.filter((column) => !inti.has(column.name));
  const kodeLama = ['kode_siswa', 'nis']
    .filter((column) => columns.has(column))
    .map((column) => `NULLIF(${quote(column)}, '')`);
  const idLama = columns.has('id') ? quote('id') : 'rowid';
  const kodeSiswa = `COALESCE(${[...kodeLama, `CAST(${idLama} AS TEXT)`].join(', ')})`;
  const jurusan = columns.has('jurusan')
    ? quote('jurusan')
    : columns.has('kelas')
      ? quote('kelas')
      : "''";
  const nilai = [
    idLama,
    kodeSiswa,
    columns.has('nama') ? quote('nama') : "''",
    columns.has('alamat') ? quote('alamat') : 'NULL',
    columns.has('tanggal_lahir') ? quote('tanggal_lahir') : 'NULL',
    jurusan,
    columns.has('created_at') ? quote('created_at') : "datetime('now', 'localtime')",
    ...kolomLama.map((column) => quote(column.name)),
  ];

  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec(`
      ALTER TABLE siswa RENAME TO siswa_lama_migrasi;
      CREATE TABLE siswa (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        kode_siswa     TEXT NOT NULL UNIQUE,
        nama           TEXT NOT NULL,
        alamat         TEXT,
        tanggal_lahir  TEXT,
        jurusan        TEXT NOT NULL DEFAULT '',
        created_at     TEXT DEFAULT (datetime('now', 'localtime'))
        ${kolomLama.map((column) => `, ${quote(column.name)} TEXT`).join('')}
      );
      INSERT INTO siswa (
        id, kode_siswa, nama, alamat, tanggal_lahir, jurusan, created_at
        ${kolomLama.map((column) => `, ${quote(column.name)}`).join('')}
      )
      SELECT ${nilai.join(', ')} FROM siswa_lama_migrasi;
      DROP TABLE siswa_lama_migrasi;
    `);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

module.exports = db;
