import { apiFetch } from './apiClient';
const API_BASE_URL = 'http://localhost:8082/api';

export const categoryService = {
  async getAllCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  async getCategoryById(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category by id');
    }
    return response.json();
  },

  async getCategoryBySlug(slug) {
    const response = await fetch(`${API_BASE_URL}/categories/slug/${slug}`);
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