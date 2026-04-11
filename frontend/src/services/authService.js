import { API_BASE } from './apiClient';

export const authService = {
  async register({ firstName, lastName, email, password }) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    if (!response.ok) {
      if (response.status === 409) {
        const error = new Error('Email already registered');
        error.code = 'DUPLICATE_EMAIL';
        throw error;
      }
      let message = 'Registration failed';
      try {
        const data = await response.json();
        message = data?.message || message;
      } catch (_) {}
      const error = new Error(message);
      error.code = 'REGISTRATION_FAILED';
      throw error;
    }

    const data = await response.json();
    return data;
  }
  ,
  async login({ email, password }) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      if (response.status === 401) {
        const error = new Error('Invalid credentials');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
      }
      let message = 'Login failed';
      try {
        const data = await response.json();
        message = data?.message || message;
      } catch (_) {}
      const error = new Error(message);
      error.code = 'LOGIN_FAILED';
      throw error;
    }

    const data = await response.json();
    return data;
  },

  async resendConfirmationEmail(email) {
    const response = await fetch(`${API_BASE}/email/resend-confirmation?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      let message = 'Failed to resend confirmation email';
      try {
        const data = await response.json();
        message = data?.message || message;
      } catch (_) {}
      const error = new Error(message);
      error.code = 'RESEND_FAILED';
      throw error;
    }

    const data = await response.json();
    return data;
  }
};
