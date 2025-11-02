import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/templates/AdminLayout/AdminLayout';
import RoomCard from '../../components/molecules/RoomCard/RoomCard';
import RoomForm from '../../components/organisms/RoomForm/RoomForm';
import ViewToggle from '../../components/atoms/ViewToggle/ViewToggle';
import RoomTable from '../../components/molecules/RoomTable/RoomTable';
import Pagination from '../../components/atoms/Pagination/Pagination';
import DeleteConfirmationModal from '../../components/organisms/DeleteConfirmationModal/DeleteConfirmationModal';
import Toast from '../../components/atoms/Toast/Toast';
import { roomService } from '../../services/roomService';
import { useToast } from '../../hooks';
import { useAuth } from '../../contexts';

const AdminRooms = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  // Inicializar viewMode desde localStorage o usar 'cards' como default
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem('adminRoomsViewMode');
    return savedViewMode || 'cards';
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { notification, showNotification, hideNotification } = useToast();

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
      setError(t('admin.rooms.errors.loadFailed'));
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
        showNotification('success', t('notifications.roomUpdatedSuccess'));
      } else {
        await roomService.createRoom(roomData);
        showNotification('success', t('notifications.roomCreatedSuccess'));
      }
      
      await loadRooms();
      setShowForm(false);
      setEditingRoom(null);
      setError('');
    } catch (err) {
      const errorMessage = editingRoom 
        ? t('notifications.roomUpdatedError')
        : t('notifications.roomCreatedError');
      setError(err.message || t('admin.rooms.errors.saveFailed'));
      showNotification('error', errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRoom(null);
  };

  // Notifications handled via useToast

  const handleDeleteRoom = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    
    try {
      setDeleteLoading(true);
      await roomService.deleteRoom(roomToDelete.id);
      await loadRooms();
      setError('');
      setShowDeleteModal(false);
      setRoomToDelete(null);
      showNotification('success', t('notifications.roomDeletedSuccess'));
    } catch {
      setError(t('admin.rooms.errors.deleteFailed'));
      showNotification('error', t('notifications.roomDeletedError'));
    } finally {
      setDeleteLoading(false);
    }
  };

  const { isAdmin, isOwner, permissions } = useAuth();
  const canCreate = isOwner || (isAdmin && permissions.includes('ROOMS_CREATE'));
  const canEdit = isOwner || (isAdmin && permissions.includes('ROOMS_EDIT'));

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
    setDeleteLoading(false);
  };

  const handleToggleAvailability = async (roomId) => {
    try {
      await roomService.toggleRoomAvailability(roomId);
      await loadRooms();
      setError('');
    } catch {
      setError(t('admin.rooms.errors.toggleAvailabilityFailed'));
    }
  };

  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  
  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(currentPage, Math.max(0, totalPages - 1));
  
  const startIndex = validCurrentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRooms = rooms.slice(startIndex, endIndex);
  
  // Update currentPage if it was out of range
  if (validCurrentPage !== currentPage && totalPages > 0) {
    setCurrentPage(validCurrentPage);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(0);
    // Guardar la preferencia en localStorage
    localStorage.setItem('adminRoomsViewMode', mode);
  };

  return (
    <AdminLayout>
      <div className="p-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showForm ? (
            <div className="bg-white/98 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700/50 p-8">
              <RoomForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                initialData={editingRoom}
                isLoading={formLoading}
                isEditMode={!!editingRoom}
              />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {t('admin.rooms.title')}
                  </h1>
                  <p className="text-base text-gray-600 dark:text-gray-300">{t('admin.rooms.description')}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <ViewToggle
                      currentView={viewMode}
                      onViewChange={handleViewModeChange}
                    />
                  </div>
                  {canCreate && (
                    <button
                      onClick={handleAddRoom}
                      className="group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-blue-400/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{t('admin.rooms.actions.addNew')}</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-red-200 dark:border-red-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{t('admin.rooms.loading')}</p>
                  </div>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-white/98 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 p-12 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-3">
                      {t('admin.rooms.noRoomsFound')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">{t('admin.rooms.addFirstRoomHint')}</p>
                    {canCreate && (
                      <button
                        onClick={handleAddRoom}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-blue-400/30"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative z-10 flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>{t('admin.rooms.actions.addFirst')}</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {currentRooms.map((room) => (
                        <div key={room.id} className="transform transition-all duration-300 hover:scale-105">
                          <RoomCard
                            room={room}
                            onEdit={handleEditRoom}
                            onDelete={handleDeleteRoom}
                            onToggleAvailability={handleToggleAvailability}
                            canEdit={canEdit}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/98 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden">
                      <RoomTable
                        rooms={currentRooms}
                        onEdit={handleEditRoom}
                        onDelete={handleDeleteRoom}
                        onToggleAvailability={handleToggleAvailability}
                        canEdit={canEdit}
                      />
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                      <Pagination
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteLoading}
        roomNumber={roomToDelete?.roomNumber}
      />

      <Toast
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={hideNotification}
      />
    </AdminLayout>
  );
};

export default AdminRooms;