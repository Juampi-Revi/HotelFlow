import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../components/atoms';
import { Header, Footer, CompactFiltersBar } from '../../components/organisms';
import useRoomsPagination from '../../hooks/useRoomsPagination';
import { formatPrice, getRoomTypeColor } from '../../utils/roomUtils';
import { categoryService } from '../../services/categoryService';
import { useAuth } from '../../contexts/AuthContext';
import { favoriteService } from '../../services/favoriteService';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [searchOverride, setSearchOverride] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  
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

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleSearchResults = (results) => {
    // Override current rooms with search results (compact UX)
    setSearchOverride(results);
  };

  // Favorites: load for authenticated users
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        return;
      }
      try {
        const ids = await favoriteService.getFavorites();
        if (Array.isArray(ids)) {
          setFavoriteIds(ids);
        }
      } catch (_) {
        // ignore
      }
    };
    loadFavorites();
  }, [isAuthenticated]);

  const isFavorite = (roomId) => favoriteIds.includes(roomId);

  const toggleFavorite = async (e, roomId) => {
    e.stopPropagation();
    if (!isAuthenticated) return;
    try {
      if (isFavorite(roomId)) {
        setFavoriteIds(prev => prev.filter(id => id !== roomId));
        await favoriteService.removeFavorite(roomId);
      } else {
        setFavoriteIds(prev => [...prev, roomId]);
        await favoriteService.addFavorite(roomId);
      }
    } catch (_) {
      // revert optimistic change
      setFavoriteIds(prev => {
        const has = prev.includes(roomId);
        return has ? prev.filter(id => id !== roomId) : [...prev, roomId];
      });
    }
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

          {categories.length > 0 && (
            <div className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {t('categories.title')}
                </div>
                {selectedCategoryIds.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCategoryFilters}
                    className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline self-start sm:self-auto"
                  >
                    {t('categories.clearFilters')}
                  </button>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={
                        isSelected
                          ? 'px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700'
                          : 'px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
                      }
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                        {room.roomType ? t(`room.types.${String(room.roomType).toLowerCase()}`) : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, room.id)}
                      aria-label={isFavorite(room.id) ? t('favorites.remove') : t('favorites.add')}
                      title={!isAuthenticated ? t('favorites.loginToFavorite') : (isFavorite(room.id) ? t('favorites.remove') : t('favorites.add'))}
                      className="absolute bottom-3 right-3 bg-white/80 dark:bg-gray-900/60 text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-gray-900 rounded-full p-2 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite(room.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.878 0-3.5 1.09-4.312 2.667C11.188 4.84 9.566 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 5.25 9 11.25 9 11.25s9-6 9-11.25z" />
                      </svg>
                    </button>
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
