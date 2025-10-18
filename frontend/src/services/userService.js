import { apiFetch } from './apiClient';

export const userService = {
  async listUsers(page = 0, size = 20) {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    return apiFetch(`/admin/users?${params.toString()}`);
  },

  async updateRole(userId, makeAdmin) {
    return apiFetch(`/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ makeAdmin })
    });
  },

  async updatePermissions(userId, payload) {
    return apiFetch(`/admin/users/${userId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
};

export default userService;