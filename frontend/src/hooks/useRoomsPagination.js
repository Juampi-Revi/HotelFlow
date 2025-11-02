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
  const [overallTotalElements, setOverallTotalElements] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getPaginatedRooms(
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        selectedCategoryIds
      );
      setRooms(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setOverallTotalElements(response.overallTotalElements ?? response.totalElements);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage, pageSize, sortBy, sortDirection, selectedCategoryIds]);

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

  const handleCategoryToggle = (id) => {
    setSelectedCategoryIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      return next;
    });
    setCurrentPage(0);
  };

  const clearCategoryFilters = () => {
    setSelectedCategoryIds([]);
    setCurrentPage(0);
  };

  const setSelectedCategories = (ids) => {
    setSelectedCategoryIds(Array.isArray(ids) ? ids : []);
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
    overallTotalElements,
    pageSize,
    sortBy,
    sortDirection,
    selectedCategoryIds,
    // Actions
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    handleCategoryToggle,
    clearCategoryFilters,
    setSelectedCategories,
    refetch: fetchRooms
  };
};

export default useRoomsPagination;