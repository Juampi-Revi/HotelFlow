import { useTranslation } from 'react-i18next';
import RoomCard from '../molecules/ProductCard/RoomCard';

const RoomGrid = ({ rooms = [], title, isLoading = false, favoriteIds = [], onToggleFavorite }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {title}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {title}
            </h2>
          )}
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {t('room.noRooms')}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {t('room.noRoomsDescription')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const displayRooms = rooms.slice(0, 10);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {title}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              canEdit={false} // Disable edit mode in grid
              isFavorite={favoriteIds.includes(room.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        {rooms.length > 10 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('room.showingRooms', { 
                showing: displayRooms.length, 
                total: rooms.length 
              })}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomGrid;