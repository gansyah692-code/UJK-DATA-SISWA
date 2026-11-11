function formatTanggal(t) {
  if (!t) return '-';
  const [y, m, d] = t.split('-');
  return `${d}/${m}/${y}`;
}

export default function SiswaTable({ data, onUbah, onHapus }) {
  return (
    <div className="tabel-bungkus">
      <table>
        <thead>
          <tr>
            <th>kode siswa</th>
            <th>nama</th>
            <th>alamat</th>
            <th>tanggal lahir</th>
            <th>jurusan</th>
            <th aria-label="Aksi" />
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.id}>
              <td className="nis">{s.kode_siswa}</td>
              <td className="nama">{s.nama}</td>
              <td className="alamat">{s.alamat}</td>
              <td>{formatTanggal(s.tanggal_lahir)}</td>
              <td>{s.jurusan || '-'}</td>
              <td className="aksi">
                <button className="tombol kecil" onClick={() => onUbah(s)}>Ubah</button>
                <button className="tombol kecil bahaya" onClick={() => onHapus(s)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
