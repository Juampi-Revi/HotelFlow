import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../../components/atoms';
import { Header, Footer } from '../../components/organisms';
import { ImageGallery } from '../../components/molecules';
import useRoomsPagination from '../../hooks/useRoomsPagination';
import { formatPrice, getRoomTypeColor, getAvailabilityColor, formatGuestCount } from '../../utils/roomUtils';
import { categoryService } from '../../services/categoryService';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    rooms,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    sortBy,
    sortDirection,
    handlePageChange,
    handleSortChange,
    handlePageSizeChange,
    handleCategoryChange,
    categoryId
  } = useRoomsPagination();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const list = await categoryService.getAllCategories();
        setCategories(list.filter(c => c.isActive !== false));
      } catch (err) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const filteredRooms = rooms;

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.allRooms')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('common.discoverCollection', { count: totalElements })}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('admin.room.fields.category')}
            </label>
            <select
              value={categoryId || ''}
              onChange={(e) => handleCategoryChange(e.target.value ? Number(e.target.value) : null)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('categories.all')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>


        {false && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder={t('common.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Sort and Page Size Controls */}
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="id">{t('common.sortById')}</option>
                    <option value="pricePerNight">{t('common.sortByPrice')}</option>
                    <option value="hotelName">{t('common.sortByHotel')}</option>
                    <option value="city">{t('common.sortByCity')}</option>
                    <option value="hotelRating">{t('common.sortByRating')}</option>
                  </select>
                </div>

                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6 {t('common.perPage')}</option>
                  <option value={12}>12 {t('common.perPage')}</option>
                  <option value={24}>24 {t('common.perPage')}</option>
                  <option value={48}>48 {t('common.perPage')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {t('common.showing', { 
              start: currentPage * pageSize + 1, 
              end: Math.min((currentPage + 1) * pageSize, totalElements), 
              total: totalElements 
            })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('common.page', { current: currentPage + 1, total: totalPages })}
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredRooms.map((room) => (
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
                  {room.hasWifi && (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                      WiFi
                    </span>
                  )}
                  {room.hasAirConditioning && (
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                      A/C
                    </span>
                  )}
                  {room.hasBalcony && (
                    <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded">
                      Balcony
                    </span>
                  )}
                  {room.amenities && room.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={`amenity-${room.id}-${index}`} className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities && room.amenities.length > 3 && (
                    <span className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                      +{room.amenities.length - 3} more
                    </span>
                  )}
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
          totalPages={totalPages}
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