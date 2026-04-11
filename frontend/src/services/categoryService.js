import { apiFetch, API_BASE } from './apiClient';

export const categoryService = {
  async getAllCategories() {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  async getCategoryById(id) {
    const response = await fetch(`${API_BASE}/categories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category by id');
    }
    return response.json();
  },

  async getCategoryBySlug(slug) {
    const response = await fetch(`${API_BASE}/categories/slug/${slug}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category by slug');
    }
    return response.json();
  },

  async createCategory(data) {
    return apiFetch('/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateCategory(id, data) {
    return apiFetch(`/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async deleteCategory(id) {
    await apiFetch(`/categories/${id}`, { method: 'DELETE' });
  },

  async toggleActive(id) {
    return apiFetch(`/categories/${id}/toggle-active`, { method: 'PATCH' });
  }
};
