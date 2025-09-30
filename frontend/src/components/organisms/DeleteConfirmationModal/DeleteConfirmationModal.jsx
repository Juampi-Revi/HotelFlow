import { useTranslation } from 'react-i18next';
import { Button } from '../../atoms';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onCancel, 
  onConfirm, 
  roomNumber, 
  isLoading = false 
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('deleteConfirmation.title')}
          </h2>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {t('deleteConfirmation.message')}
          </p>
          <p className="text-gray-900 dark:text-white font-medium">
            {roomNumber ? `Room ${roomNumber}` : 'this room'}
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">
            {t('deleteConfirmation.warning')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2"
          >
            {t('deleteConfirmation.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('deleteConfirmation.deleting')}
              </div>
            ) : (
              t('deleteConfirmation.delete')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;