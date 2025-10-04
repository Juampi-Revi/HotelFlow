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
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create room');
    }
    
    return response.json();
  },

  async updateRoom(id, roomData) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update room');
    }
    
    return response.json();
  },

  async deleteRoom(id) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete room');
    }
  },

  async toggleRoomAvailability(id) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}/toggle-availability`, {
      method: 'PATCH',
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle room availability');
    }
    
    return response.json();
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

  async getPaginatedRooms(page = 0, size = 10, sortBy = 'id', sortDirection = 'asc') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDirection
    });
    
    const response = await fetch(`${API_BASE_URL}/rooms/paginated?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch paginated rooms');
    }
    return response.json();
  }
};