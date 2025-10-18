import { useState, useEffect } from 'react';
import { roomService } from '../services/roomService';

const useRoomsPagination = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0-based to match backend
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [sortBy, setSortBy] = useState('id'); // Default sort field to match backend
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [categoryId, setCategoryId] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      if (categoryId) {
        const list = await roomService.getRoomsByCategoryId(categoryId);
        const sorted = [...list].sort((a, b) => {
          const dir = sortDirection === 'asc' ? 1 : -1;
          const va = a[sortBy];
          const vb = b[sortBy];
          if (va === vb) return 0;
          return va > vb ? dir : -dir;
        });
        setRooms(sorted);
        setTotalPages(1);
        setTotalElements(sorted.length);
      } else {
        const response = await roomService.getPaginatedRooms(
          currentPage,
          pageSize,
          sortBy,
          sortDirection
        );
        setRooms(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage, pageSize, sortBy, sortDirection, categoryId]);

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
    setCurrentPage(0); // Reset to page 0 (first page)
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to page 0 (first page)
  };

  const handleCategoryChange = (id) => {
    setCategoryId(id || null);
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
    categoryId,
    // Actions
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    handleCategoryChange,
    refetch: fetchRooms
  };
};

export default useRoomsPagination;