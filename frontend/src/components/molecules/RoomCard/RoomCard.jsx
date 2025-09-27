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
    bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
    overflow-hidden transition-all duration-200 hover:shadow-lg
    ${!room.isAvailable ? 'opacity-75' : ''}
  `;

  const statusClasses = `
    px-2 py-1 rounded-full text-xs font-medium
    ${room.isAvailable 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
  `;

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
            <span className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
              +{room.images.length - 1}
            </span>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t(`admin.room.types.${room.roomType}`)}
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

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="small"
            onClick={() => onEdit(room)}
          >
            {t('admin.room.actions.edit')}
          </Button>
          <Button
            variant={room.isAvailable ? 'secondary' : 'primary'}
            size="small"
            onClick={() => onToggleAvailability(room.id)}
          >
            {room.isAvailable ? t('admin.room.actions.disable') : t('admin.room.actions.enable')}
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => onDelete(room.id)}
          >
            {t('admin.room.actions.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;