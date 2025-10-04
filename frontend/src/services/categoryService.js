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
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to create category');
    }
    return response.json();
  },

  async updateCategory(id, data) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to update category');
    }
    return response.json();
  },

  async deleteCategory(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to delete category');
    }
  },

  async toggleActive(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}/toggle-active`, {
      method: 'PATCH'
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Failed to toggle category active state');
    }
    return response.json();
  }
};