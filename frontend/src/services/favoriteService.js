import { apiFetch } from './apiClient';

const notifyFavoritesChanged = (action, roomId) => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('hf:favoritesChanged', { detail: { action, roomId } }));
  } catch (_) {}
};

export const favoriteService = {
  async getFavorites() {
    return apiFetch('/favorites');
  },
  async getFavoriteRooms() {
    return apiFetch('/favorites/rooms');
  },
  async addFavorite(roomId) {
    const res = await apiFetch(`/favorites/${roomId}`, { method: 'POST' });
    notifyFavoritesChanged('add', roomId);
    return res;
  },
  async removeFavorite(roomId) {
    const res = await apiFetch(`/favorites/${roomId}`, { method: 'DELETE' });
    notifyFavoritesChanged('remove', roomId);
    return res;
  }
};

export default favoriteService;
