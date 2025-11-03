import { apiFetch } from './apiClient';
const API_BASE_URL = 'http://localhost:8082/api';

export const roomService = {
  async getAllRooms() {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }
    return response.json();
  },

  async getRoomById(id) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`);
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
    const response = await fetch(`${API_BASE_URL}/rooms/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available rooms');
    }
    return response.json();
  },

  async getRoomsByType(roomType) {
    const response = await fetch(`${API_BASE_URL}/rooms/type/${roomType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms by type');
    }
    return response.json();
  },

  async getRoomsByCategoryId(categoryId) {
    const response = await fetch(`${API_BASE_URL}/rooms?categoryId=${encodeURIComponent(categoryId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch rooms by category id');
    }
    return response.json();
  },

  async getRoomsByCategorySlug(categorySlug) {
    const response = await fetch(`${API_BASE_URL}/rooms?categorySlug=${encodeURIComponent(categorySlug)}`);
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
    
    const response = await fetch(`${API_BASE_URL}/rooms/paginated?${params}`);
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

    const response = await fetch(`${API_BASE_URL}/rooms/search?${params}`);
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
    const response = await fetch(`${API_BASE_URL}/rooms/suggestions?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch destination suggestions');
    }
    return response.json();
  }
};