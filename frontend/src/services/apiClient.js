const API_BASE_URL = 'http://localhost:8082/api';

export const apiFetch = async (path, options = {}) => {
  let token = null;
  try {
    const raw = localStorage.getItem('hf_auth');
    token = raw ? JSON.parse(raw)?.token : null;
  } catch (_) {}

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const resp = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!resp.ok) {
    let message = `Request failed (${resp.status})`;
    try {
      const text = await resp.text();
      message = text || message;
    } catch (_) {}
    const err = new Error(message);
    err.status = resp.status;
    // Notify app to logout on unauthorized responses
    if (resp.status === 401 && typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('hf:unauthorized'));
      } catch (_) {}
    }
    throw err;
  }

  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return resp.json();
  }
  return resp.text();
};

export const API_BASE = API_BASE_URL;