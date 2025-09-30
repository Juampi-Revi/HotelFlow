import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';

const RoomCard = ({ room, onEdit, onDelete, onToggleAvailability }) => {
  const { t } = useTranslation();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const cardClasses = `
    group relative bg-white/98 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2
  `;

  const statusClasses = room.isAvailable
    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50 px-2 py-1 rounded-full text-xs font-medium'
    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700/50 px-2 py-1 rounded-full text-xs font-medium';

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('admin.room.roomNumber', { number: room.roomNumber })}
        </h3>
        <span className={statusClasses}>
          {room.isAvailable ? t('admin.room.available') : t('admin.room.unavailable')}
        </span>
      </div>

      {room.images && room.images.length > 0 && (
        <div className="relative">
          <img 
            src={room.images[0]} 
            alt={`Room ${room.roomNumber}`} 
            className="w-full h-48 object-cover"
          />
          {room.images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium border border-white/30">
              {room.images.length} {t('rooms.images')}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t(`admin.room.types.${room.roomType.toLowerCase()}`)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.room.capacity', { capacity: room.capacity })}
          </p>
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(room.pricePerNight)}/{t('admin.room.perNight')}
          </p>
        </div>

        {room.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-700/50"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-600/50">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onEdit(room)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50 dark:hover:bg-blue-900/50"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('admin.room.actions.edit')}
          </button>
          <button
            onClick={() => onToggleAvailability(room.id)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 focus:ring-amber-500 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50 dark:hover:bg-amber-900/50"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={room.isAvailable ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
            </svg>
            {room.isAvailable ? t('admin.room.actions.disable') : t('admin.room.actions.enable')}
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50 dark:hover:bg-red-900/50"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('admin.room.actions.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;