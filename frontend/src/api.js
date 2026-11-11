async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(body?.message || 'Terjadi kesalahan.');
  return body;
}

export const api = {
  list: (q = '') => request(`/api/siswa?q=${encodeURIComponent(q)}`),
  create: (data) => request('/api/siswa', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/siswa/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`/api/siswa/${id}`, { method: 'DELETE' }),
};
