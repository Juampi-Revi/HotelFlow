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
  }
};