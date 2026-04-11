import { apiFetch } from './apiClient';

export const bookingService = {
  async createBooking({ roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests }) {
    return apiFetch('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, checkInDate, checkOutDate, numberOfGuests, specialRequests })
    });
  },

  async getMyBookings() {
    return apiFetch('/bookings/me', { method: 'GET' });
  },

  async getMyBooking(bookingId) {
    return apiFetch(`/bookings/${bookingId}`, { method: 'GET' });
  },

  async cancelMyBooking(bookingId) {
    return apiFetch(`/bookings/${bookingId}/cancel`, { method: 'PATCH' });
  },

  async deleteMyBooking(bookingId) {
    return apiFetch(`/bookings/${bookingId}`, { method: 'DELETE' });
  },

  async getAdminBookings() {
    return apiFetch('/admin/bookings', { method: 'GET' });
  },

  async deleteAdminBooking(bookingId) {
    return apiFetch(`/admin/bookings/${bookingId}`, { method: 'DELETE' });
  }
};

export default bookingService;
