import { apiFetch } from './apiClient';

export const featureService = {
  async getActiveFeatures() {
    return apiFetch('/features');
  },

  async getAllFeatures() {
    return apiFetch('/features/all');
  },

  async createFeature(data) {
    return apiFetch('/features', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateFeature(id, data) {
    return apiFetch(`/features/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteFeature(id) {
    await apiFetch(`/features/${id}`, { method: 'DELETE' });
  },

  async toggleActive(id) {
    return apiFetch(`/features/${id}/toggle-active`, { method: 'PATCH' });
  }
};

export default featureService;