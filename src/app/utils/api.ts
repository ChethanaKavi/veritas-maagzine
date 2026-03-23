export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('adminToken');
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}

export default apiFetch;
