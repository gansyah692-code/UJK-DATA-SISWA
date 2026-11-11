import { useEffect, useState } from 'react';
import { api } from './api';
import SiswaTable from './components/SiswaTable.jsx';
import SiswaForm from './components/SiswaForm.jsx';

export default function App() {
  const [siswa, setSiswa] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formAwal, setFormAwal] = useState(null); // null = tertutup, {} = tambah, objek = ubah
  const [pesan, setPesan] = useState('');

  async function muat(kata = q) {
    try {
      setError('');
      setSiswa(await api.list(kata));
    } catch (e) {
      setError('Gagal memuat data. Pastikan server backend sudah berjalan.');
    } finally {
      setLoading(false);
    }
  }

  // Muat ulang saat kata kunci berubah (dengan jeda singkat)
  useEffect(() => {
    const t = setTimeout(() => muat(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  function tampilkanPesan(teks) {
    setPesan(teks);
    setTimeout(() => setPesan(''), 2500);
  }

  async function simpan(data) {
    if (formAwal?.id) {
      await api.update(formAwal.id, data);
      tampilkanPesan('Data siswa disimpan.');
    } else {
      await api.create(data);
      tampilkanPesan('Siswa ditambahkan.');
    }
    setFormAwal(null);
    muat();
  }

  async function hapus(s) {
    if (!window.confirm(`Hapus data ${s.nama}? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api.remove(s.id);
      tampilkanPesan('Siswa dihapus.');
      muat();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="halaman">
      <header className="kepala">
        <div>
          <h1>Data Siswa</h1>
          <p className="sub">{siswa.length} siswa {q && `untuk “${q}”`}</p>
        </div>
        <button className="tombol utama" onClick={() => setFormAwal({})}>
          Tambah siswa
        </button>
      </header>

      <input
        className="cari"
        type="search"
        placeholder="Cari nama, NIS, atau kelas"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Cari siswa"
      />

      {error && <div className="galat" role="alert">{error}</div>}

      {loading ? (
        <p className="kosong">Memuat data…</p>
      ) : siswa.length === 0 ? (
        <div className="kosong">
          {q ? 'Tidak ada siswa yang cocok dengan pencarian.' : 'Belum ada data siswa. Klik “Tambah siswa” untuk memulai.'}
        </div>
      ) : (
        <SiswaTable data={siswa} onUbah={setFormAwal} onHapus={hapus} />
      )}

      {formAwal && (
        <SiswaForm awal={formAwal} onSimpan={simpan} onBatal={() => setFormAwal(null)} />
      )}

      {pesan && <div className="toast" role="status">{pesan}</div>}
    </div>
  );
}
