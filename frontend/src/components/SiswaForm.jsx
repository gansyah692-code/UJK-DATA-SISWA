import { useState } from 'react';

const KOSONG = {
  kode_siswa: '',
  nama: '',
  alamat: '',
  tanggal_lahir: '',
  jurusan: '',
};

export default function SiswaForm({ awal, onSimpan, onBatal }) {
  const ubah = Boolean(awal.id);
  const [v, setV] = useState({
    ...KOSONG,
    ...Object.fromEntries(Object.entries(awal).map(([k, val]) => [k, val ?? ''])),
  });
  const [galat, setGalat] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function kirim(e) {
    e.preventDefault();
    setGalat('');
    setMenyimpan(true);
    try {
      await onSimpan(v);
    } catch (err) {
      setGalat(err.message);
      setMenyimpan(false);
    }
  }

  return (
    <div className="latar" onMouseDown={(e) => e.target === e.currentTarget && onBatal()}>
      <form className="modal" onSubmit={kirim}>
        <h2>{ubah ? 'Ubah data siswa' : 'Tambah siswa'}</h2>

        <div className="baris">
          <label>
            kode siswa
            <input value={v.kode_siswa} onChange={set('kode_siswa')} required autoFocus />
          </label>
          <label>
            nama
            <input value={v.nama} onChange={set('nama')} placeholder="Contoh: John Doe" required />
          </label>
        </div>

        <label>
          alamat
          <input value={v.alamat} onChange={set('alamat')} required />
        </label>

        <label>
          tanggal lahir
          <input value={v.tanggal_lahir} onChange={set('tanggal_lahir')} required />
        </label>
        
        <label>
          jurusan
          <input value={v.jurusan} onChange={set('jurusan')} required />
        </label>

        {galat && <div className="galat" role="alert">{galat}</div>}

        <div className="tombol-form">
          <button type="button" className="tombol" onClick={onBatal}>Batal</button>
          <button type="submit" className="tombol utama" disabled={menyimpan}>
            {menyimpan ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
