import { apiFetch, API_BASE } from './apiClient';
import { formatDateYMD } from '../utils/roomUtils';

export const roomService = {
  async getAllRooms() {
    const response = await fetch(`${API_BASE}/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    return response.json();
  },

  async getRoomById(id) {
    const response = await fetch(`${API_BASE}/rooms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch room');
    }
    return response.json();
  },

  async createRoom(roomData) {
    return apiFetch('/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
  },

  async updateRoom(id, roomData) {
    return apiFetch(`/rooms/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    });
  },

  async deleteRoom(id) {
    await apiFetch(`/rooms/${id}`, { method: 'DELETE' });
  },

  async toggleRoomAvailability(id) {
    return apiFetch(`/rooms/${id}/toggle-availability`, { method: 'PATCH' });
  },

  async getAvailableRooms() {
    const response = await fetch(`${API_BASE}/rooms/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available rooms');
    }
    return response.json();
  },

  async getRoomsByType(roomType) {
    const response = await fetch(`${API_BASE}/rooms/type/${roomType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms by type');
    }
    return response.json();
  },

  async getRoomsByCategoryId(categoryId) {
    const response = await fetch(`${API_BASE}/rooms?categoryId=${encodeURIComponent(categoryId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms by category id');
    }
    return response.json();
  },

  async getRoomsByCategorySlug(categorySlug) {
    const response = await fetch(`${API_BASE}/rooms?categorySlug=${encodeURIComponent(categorySlug)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms by category slug');
    }
    return response.json();
  },

  getRoomsForHome: async () => {
    const rooms = await roomService.getAllRooms();
    return rooms.slice(0, 10);
  },

  async getPaginatedRooms(page = 0, size = 10, sortBy = 'id', sortDirection = 'asc', categoryIds = []) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection
    });
    
    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach(id => params.append('categoryIds', id));
    }
    
    const response = await fetch(`${API_BASE}/rooms/paginated?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch paginated rooms');
    }
    return response.json();
  },

  async searchRooms(searchParams) {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${API_BASE}/rooms/search?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search rooms');
    }
    return response.json();
  },

  async getDestinationSuggestions(query) {
    if (!query || query.length < 2) {
      return [];
    }
    
    const params = new URLSearchParams({ query });
    const response = await fetch(`${API_BASE}/rooms/suggestions?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destination suggestions');
    }
    return response.json();
  },

  // Availability methods
  async getRoomAvailability(roomId, startDate, months = 2) {
    const params = new URLSearchParams({
      startDate: startDate || formatDateYMD(new Date()),
      months: months.toString()
    });
    
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch room availability');
    }
    return response.json();
  },

  async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
    const params = new URLSearchParams({
      checkInDate,
      checkOutDate
    });
    
    const response = await fetch(`${API_BASE}/rooms/${roomId}/availability/check?${params}`);
    if (!response.ok) {
      throw new Error('Failed to check room availability');
    }
    return response.json();
  },

  async getOccupiedDates(roomId, startDate, endDate) {
    const params = new URLSearchParams({
      startDate,
      endDate
    });
    
    const response = await fetch(`${API_BASE}/rooms/${roomId}/occupied-dates?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch occupied dates');
    }
    return response.json();
  },

  async getRoomReviews(roomId) {
    const response = await fetch(`${API_BASE}/rooms/${roomId}/reviews`);
    if (!response.ok) {
      throw new Error('Failed to fetch room reviews');
    }
    return response.json();
  },

  async canCurrentUserReviewRoom(roomId) {
    return apiFetch(`/reviews/rooms/${roomId}/eligibility`, { method: 'GET' });
  },

  async createOrUpdateRoomReview({ roomId, rating, comment }) {
    return apiFetch('/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, rating, comment })
    });
  }
};
