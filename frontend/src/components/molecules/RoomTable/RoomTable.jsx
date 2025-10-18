import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';

const RoomTable = ({ rooms, onEdit, onDelete, onToggleAvailability, canEdit = true }) => {
  const { t } = useTranslation();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusBadge = (isAvailable) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const statusClasses = isAvailable
      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50'
      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700/50';
    
    return (
      <span className={`${baseClasses} ${statusClasses}`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
        {isAvailable ? t('admin.room.available') : t('admin.room.unavailable')}
      </span>
    );
  };

  const ActionButton = ({ variant, size = 'small', onClick, children, icon }) => (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        ${variant === 'edit' ? 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50 dark:hover:bg-blue-900/50' : ''}
        ${variant === 'toggle' ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 focus:ring-amber-500 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50 dark:hover:bg-amber-900/50' : ''}
        ${variant === 'delete' ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50 dark:hover:bg-red-900/50' : ''}
      `}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {t('admin.rooms.noRoomsFound')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t('admin.rooms.addFirstRoomHint')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/98 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
      <div>
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.id')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.roomNumber')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.type')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.capacity')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.price')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.status')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t('admin.rooms.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  #{room.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {room.images && room.images.length > 0 ? (
                        <img 
                          className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600" 
                          src={room.images[0]} 
                          alt={`Room ${room.roomNumber}`} 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {t('admin.room.roomNumber', { number: room.roomNumber })}
                      </div>
                      {room.images && room.images.length > 1 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {room.images.length} {t('rooms.images')}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {t(`admin.rooms.types.${room.roomType}`)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {room.capacity} {t('admin.room.guests')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {formatPrice(room.pricePerNight)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(room.isAvailable)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {canEdit && (
                      <ActionButton
                        variant="edit"
                        onClick={() => onEdit(room)}
                        icon={
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        }
                      >
                        {t('admin.room.actions.edit')}
                      </ActionButton>
                    )}
                    <ActionButton
                      variant="toggle"
                      onClick={() => onToggleAvailability(room.id)}
                      icon={
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={room.isAvailable ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>
                      }
                    >
                      {room.isAvailable ? t('admin.room.actions.disable') : t('admin.room.actions.enable')}
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => onDelete(room.id)}
                      icon={
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      }
                    >
                      {t('admin.room.actions.delete')}
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;