import { API_BASE } from './apiClient';

export const productService = {
  async getAllProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  async getProductById(id) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  async getProductsByCategory(category) {
    const response = await fetch(`${API_BASE}/products/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    return response.json();
  },

  async getAvailableProducts() {
    const response = await fetch(`${API_BASE}/products/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available products');
    }
    return response.json();
  },

  async getRandomProducts(limit = 10) {
    const response = await fetch(`${API_BASE}/products/random?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch random products');
    }
    return response.json();
  },

  async getProductsForHome() {
    const response = await fetch(`${API_BASE}/products/home`);
    if (!response.ok) {
      throw new Error('Failed to fetch products for home');
    }
    return response.json();
  },

  async createProduct(productData) {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    
    return response.json();
  },

  async updateProduct(id, productData) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }
    
    return response.json();
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  },

  async toggleProductAvailability(id) {
    const response = await fetch(`${API_BASE}/products/${id}/toggle-availability`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle product availability');
    }
    
    return response.json();
  }
};
