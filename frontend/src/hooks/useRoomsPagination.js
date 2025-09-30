import { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

const useRoomsPagination = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Cambio a 0-based para coincidir con backend
  const [pageSize, setPageSize] = useState(10); // Cambio a 6 como default para coincidir con ProductsPage
  const [sortBy, setSortBy] = useState('id'); // Cambio a 'id' para coincidir con backend default
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getPaginatedRooms(
        currentPage, // Ya es 0-based
        pageSize,
        sortBy,
        sortDirection
      );
      setRooms(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage, pageSize, sortBy, sortDirection]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(0); // Reset a página 0 (primera página)
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset a página 0 (primera página)
  };

  return {
    // State
    rooms,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    sortBy,
    sortDirection,
    // Actions
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    refetch: fetchRooms
  };
};

export default useRoomsPagination;