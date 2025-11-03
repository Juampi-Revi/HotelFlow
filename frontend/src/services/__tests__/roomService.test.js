import { roomService } from '../roomService';

// Mock fetch
global.fetch = jest.fn();

describe('roomService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('searchRooms', () => {
    test('makes correct API call with all parameters', async () => {
      const mockResponse = {
        content: [{ id: 1, name: 'Test Room' }],
        totalElements: 1,
        totalPages: 1
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const searchParams = {
        destination: 'Paris',
        checkIn: '2024-12-01',
        checkOut: '2024-12-05',
        guests: 2,
        minPrice: 100,
        maxPrice: 500,
        roomType: 'SINGLE',
        categoryIds: [1, 2],
        page: 0,
        size: 10,
        sortBy: 'price',
        sortDirection: 'asc'
      };

      const result = await roomService.searchRooms(searchParams);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8082/api/rooms/search?destination=Paris&checkIn=2024-12-01&checkOut=2024-12-05&guests=2&minPrice=100&maxPrice=500&roomType=SINGLE&categoryIds=1&categoryIds=2&page=0&size=10&sortBy=price&sortDirection=asc'
      );
      expect(result).toEqual(mockResponse);
    });

    test('makes API call with minimal parameters', async () => {
      const mockResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const searchParams = {
        page: 0,
        size: 10
      };

      const result = await roomService.searchRooms(searchParams);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8082/api/rooms/search?page=0&size=10'
      );
      expect(result).toEqual(mockResponse);
    });

    test('handles API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(roomService.searchRooms({ page: 0, size: 10 }))
        .rejects
        .toThrow('Failed to search rooms');
    });

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(roomService.searchRooms({ page: 0, size: 10 }))
        .rejects
        .toThrow('Network error');
    });
  });

  describe('getDestinationSuggestions', () => {
    test('makes correct API call and returns suggestions', async () => {
      const mockSuggestions = ['Paris', 'London', 'Madrid'];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuggestions,
      });

      const result = await roomService.getDestinationSuggestions('Par');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8082/api/rooms/suggestions?query=Par'
      );
      expect(result).toEqual(mockSuggestions);
    });

    test('handles empty query', async () => {
      const result = await roomService.getDestinationSuggestions('');
      
      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('handles short query (less than 2 characters)', async () => {
      const result = await roomService.getDestinationSuggestions('P');
      
      expect(fetch).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('handles API error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(roomService.getDestinationSuggestions('Par'))
        .rejects
        .toThrow('Failed to fetch destination suggestions');
    });

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(roomService.getDestinationSuggestions('Par'))
        .rejects
        .toThrow('Network error');
    });
  });
});