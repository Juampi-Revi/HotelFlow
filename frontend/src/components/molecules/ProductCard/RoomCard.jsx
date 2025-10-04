import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleCardClick = () => {
    navigate(`/room/${room.id}`);
  };

  const cardClasses = `
    bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 
    hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer
    p-6 max-w-sm mx-auto relative group flex flex-col
  `;

  const statusClasses = `
    px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm
    ${room.isAvailable 
      ? 'bg-green-100/80 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200/50' 
      : 'bg-red-100/80 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200/50'
    }
  `;

  return (
    <div className={cardClasses} onClick={handleCardClick}>
      {room.images && room.images.length > 0 && (
        <div className="relative overflow-hidden">
          <img 
            src={room.images[0]} 
            alt={`Room ${room.roomNumber}`} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {room.images.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-semibold border border-white/20">
              +{room.images.length - 1}
            </span>
          )}
          <span className={`absolute top-3 left-3 ${statusClasses}`}>
            {room.isAvailable ? t('room.available') : t('room.unavailable')}
          </span>
        </div>
      )}

      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent line-clamp-2">
            {t('room.roomNumber', { number: room.roomNumber })}
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
          {room.description}
        </p>
        {(room?.category?.name || room?.categoryName) && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
              {room?.category?.name ?? room?.categoryName}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-sm font-semibold text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800/80 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-600 w-full text-center">
            {t(`room.types.${room.roomType.toLowerCase()}`)}
          </span>
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-200 bg-purple-100 dark:bg-purple-800/80 px-3 py-1.5 rounded-md border border-purple-200 dark:border-purple-600 w-full text-center">
            {t('room.capacity', { capacity: room.capacity })}
          </span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 px-3 py-1 rounded-full font-medium border border-blue-200/50 dark:border-blue-700/50">
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  +{room.amenities.length - 3} {t('room.moreAmenities')}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {formatPrice(room.pricePerNight)}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              {t('room.perNight')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Overlay "Ver más" en hover */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
        <div className="text-white text-lg font-semibold bg-blue-600 px-6 py-3 rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Ver más
        </div>
      </div>
    </div>
  );
};

export default RoomCard;