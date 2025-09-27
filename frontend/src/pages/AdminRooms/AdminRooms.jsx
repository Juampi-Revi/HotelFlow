import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import Button from '../../components/atoms/Button/Button';
import RoomCard from '../../components/molecules/RoomCard/RoomCard';
import RoomForm from '../../components/organisms/RoomForm/RoomForm';
import { roomService } from '../../services/roomService';

const AdminRooms = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await roomService.getAllRooms();
      setRooms(roomsData);
      setError('');
    } catch {
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowForm(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowForm(true);
  };

  const handleFormSubmit = async (roomData) => {
    try {
      setFormLoading(true);
      
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, roomData);
      } else {
        await roomService.createRoom(roomData);
      }
      
      await loadRooms();
      setShowForm(false);
      setEditingRoom(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save room. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(roomId);
        await loadRooms();
        setError('');
      } catch {
        setError('Failed to delete room. Please try again.');
      }
    }
  };

  const handleToggleAvailability = async (roomId) => {
    try {
      await roomService.toggleRoomAvailability(roomId);
      await loadRooms();
      setError('');
    } catch {
      setError('Failed to update room availability. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showForm ? (
            <RoomForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={editingRoom}
              isLoading={formLoading}
            />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('admin.rooms.title')}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{t('admin.rooms.description')}</p>
                </div>
                <Button onClick={handleAddRoom} variant="primary">
                  {t('admin.rooms.actions.addNew')}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex justify-between items-center">
                  <p className="text-red-800 dark:text-red-400">{error}</p>
                  <Button variant="secondary" size="small" onClick={() => setError('')}>
                    {t('common.dismiss')}
                  </Button>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">{t('admin.rooms.loading')}</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('admin.rooms.noRoomsFound')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t('admin.rooms.addFirstRoomHint')}</p>
                  <Button onClick={handleAddRoom} variant="primary">
                    {t('admin.rooms.actions.addFirst')}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onEdit={handleEditRoom}
                      onDelete={handleDeleteRoom}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;