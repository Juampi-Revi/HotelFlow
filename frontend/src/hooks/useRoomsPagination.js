import { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

const useRoomsPagination = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getPaginatedRooms(
        currentPage,
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
    setCurrentPage(0);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
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