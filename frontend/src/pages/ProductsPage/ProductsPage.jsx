import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../components/atoms';
import { Header, Footer, CompactFiltersBar } from '../../components/organisms';
import { ImageGallery } from '../../components/molecules';
import useRoomsPagination from '../../hooks/useRoomsPagination';
import { formatPrice, getRoomTypeColor, getAvailabilityColor, formatGuestCount } from '../../utils/roomUtils';
import { categoryService } from '../../services/categoryService';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOverride, setSearchOverride] = useState(null);
  
  const {
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
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    handleCategoryToggle,
    clearCategoryFilters,
    setSelectedCategories,
    selectedCategoryIds
  } = useRoomsPagination();

  const [categories, setCategories] = useState([]);
  // Dropdown state
  const [isCatOpen, setIsCatOpen] = useState(false);
  const catDropdownRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await categoryService.getAllCategories();
        const active = list.filter(c => c.isActive !== false);
        setCategories(active);
        // Parse initial categoryIds from query string
        const params = new URLSearchParams(location.search);
        const idsParam = params.get('categoryIds') || params.get('categoryId');
        if (idsParam) {
          const parsed = idsParam.split(',').map((x) => Number(x)).filter((n) => !isNaN(n));
          const valid = parsed.filter((id) => active.some((c) => c.id === id));
          if (valid.length > 0) {
            setSelectedCategories(valid);
          }
        }
      } catch (err) {
        setCategories([]);
      }
    };
    loadCategories();
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCatOpen && catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCatOpen]);

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleSearchResults = (results) => {
    // Override current rooms with search results (compact UX)
    setSearchOverride(results);
  };

  // Check if we have search results from navigation
  useEffect(() => {
    if (location.state?.fromSearch && location.state?.searchResults) {
      setSearchOverride(location.state.searchResults);
    }
  }, [location.state]);

  const displayedRooms = searchOverride?.content ?? rooms;
  const displayedTotalElements = searchOverride?.totalElements ?? totalElements;
  const displayedTotalPages = searchOverride?.totalPages ?? totalPages;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 text-lg">{error}</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Compact Filters Row */}
          <div className="mb-6">
            <CompactFiltersBar onSearchResults={handleSearchResults} initialParams={location.state?.searchParams} />
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              {t('common.showingFilteredOfOverall', { 
                start: currentPage * pageSize + 1, 
                end: Math.min((currentPage + 1) * pageSize, displayedTotalElements), 
                filtered: displayedTotalElements,
                overall: overallTotalElements
              })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('common.page', { current: currentPage + 1, total: displayedTotalPages })}
            </p>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {displayedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 cursor-pointer flex flex-col h-full"
              >
                {/* Room Image */}
                {room.images && room.images.length > 0 && (
                  <div className="relative">
                    <div className="h-48 overflow-hidden rounded-t-2xl">
                      <img
                        src={room.images[0]}
                        alt={`Room ${room.roomNumber}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {room.images.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                          +{room.images.length - 1} {t('common.more')}
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.roomType)}`}>
                        {room.roomType}
                      </span>
                    </div>
                    {room.hotelRating && (
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium">
                        ⭐ {room.hotelRating}
                      </div>
                    )}
                  </div>
                )}

                {/* Room Info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                      {room.hotelName}
                    </h3>
                    {(room?.category?.name || room?.categoryName) && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
                          {room?.category?.name ?? room?.categoryName}
                        </span>
                      </div>
                    )}
                    {room.hotelChain && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {room.hotelChain}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {room.city}, {room.country}
                    </p>
                    {room.address && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {room.address}
                      </p>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('common.room')} {room.roomNumber} • {room.capacity} {room.capacity === 1 ? t('common.guest') : t('common.guests')}
                      </div>
                      {room.sizeSqm && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {room.sizeSqm}m²
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      {room.floor && (
                        <span>{t('common.floor')} {room.floor}</span>
                      )}
                      {room.viewType && (
                        <span>{room.viewType} {t('common.viewType')}</span>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {Array.isArray(room.amenities) && room.amenities.slice(0, 6).map((amenity, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoomClick(room.id);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    {t('common.viewDetails')}
                  </button>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(room.pricePerNight)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{t('common.night')}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.isAvailable
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {room.isAvailable ? t('common.available') : t('common.unavailable')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={displayedTotalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={5}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;