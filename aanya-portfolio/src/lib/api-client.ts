const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ─── Token Management ──────────────────────────────────
function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function setToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

function clearToken(): void {
  localStorage.removeItem('admin_token');
}

// ─── Fetch Wrapper ─────────────────────────────────────
async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
      const error = data?.error || `HTTP ${res.status}`;

      // Auto-logout on auth errors
      if (res.status === 401) {
        clearToken();
      }

      return { data: null, error, status: res.status };
    }

    return { data, error: null, status: res.status };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
      status: 0,
    };
  }
}

// ─── Auth ──────────────────────────────────────────────
export const authApi = {
  async login(username: string, password: string) {
    const result = await apiFetch<{ token: string; user: { username: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ username, password }) }
    );
    if (result.data?.token) {
      setToken(result.data.token);
    }
    return result;
  },

  async verify() {
    const result = await apiFetch<{ valid: boolean; user: any }>('/auth/verify');
    return result;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
  },

  logout() {
    clearToken();
  },

  isLoggedIn() {
    return !!getToken();
  },
};

// ─── Content ───────────────────────────────────────────
export const contentApi = {
  async getAll() {
    return apiFetch<Record<string, any>>('/content');
  },

  async get(key: string) {
    return apiFetch<{ key: string; data: any }>(`/content/${key}`);
  },

  async update(key: string, data: any) {
    return apiFetch(`/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async bulkUpdate(data: Record<string, any>) {
    return apiFetch('/content/bulk', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async exportAll() {
    return apiFetch<{ version: number; content: Record<string, any> }>('/content/export');
  },

  async importAll(data: any) {
    return apiFetch('/content/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async reset() {
    return apiFetch('/content/reset', { method: 'POST' });
  },
};

// ─── Stickers ──────────────────────────────────────────
export const stickersApi = {
  async getAll() {
    return apiFetch<any[]>('/stickers');
  },

  async create(sticker: any) {
    return apiFetch('/stickers', {
      method: 'POST',
      body: JSON.stringify(sticker),
    });
  },

  async update(stickerId: string, updates: any) {
    return apiFetch(`/stickers/${stickerId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async remove(stickerId: string) {
    return apiFetch(`/stickers/${stickerId}`, { method: 'DELETE' });
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const token = getToken();
    const res = await fetch(`${API_BASE}/stickers/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: data.error || 'Upload failed', status: res.status };
    // Return full URL
    return { data: { url: `${API_BASE.replace('/api', '')}${data.url}`, filename: data.filename }, error: null, status: res.status };
  },

  async bulkUpdate(stickers: any[]) {
    return apiFetch('/stickers/bulk', {
      method: 'PUT',
      body: JSON.stringify(stickers),
    });
  },
};
