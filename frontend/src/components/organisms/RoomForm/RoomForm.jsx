import { useTranslation } from 'react-i18next';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import Button from '../../atoms/Button/Button';
import ImageUpload from '../../molecules/ImageUpload/ImageUpload';
import { useRoomForm } from '../../../hooks';

const RoomForm = ({ onSubmit, onCancel, initialData = null, isLoading = false }) => {
  const { t } = useTranslation();
  
  const {
    formData,
    errors,
    roomTypeOptions,
    handleInputChange,
    handleImagesChange,
    handleSubmit
  } = useRoomForm(initialData, onSubmit);

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {initialData ? t('admin.room.editTitle') : t('admin.room.addTitle')}
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('admin.room.fields.roomNumber')}
            value={formData.roomNumber}
            onChange={handleInputChange('roomNumber')}
            placeholder={t('admin.room.placeholders.roomNumber')}
            error={errors.roomNumber}
            required
            disabled={isLoading}
          />

          <Select
            label={t('admin.room.fields.roomType')}
            value={formData.roomType}
            onChange={handleInputChange('roomType')}
            options={roomTypeOptions}
            placeholder={t('admin.room.placeholders.roomType')}
            error={errors.roomType}
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('admin.room.fields.capacity')}
            type="number"
            value={formData.capacity}
            onChange={handleInputChange('capacity')}
            placeholder={t('admin.room.placeholders.capacity')}
            min="1"
            max="10"
            error={errors.capacity}
            required
            disabled={isLoading}
          />

          <Input
            label={t('admin.room.fields.pricePerNight')}
            type="number"
            value={formData.pricePerNight}
            onChange={handleInputChange('pricePerNight')}
            placeholder={t('admin.room.placeholders.price')}
            min="0"
            step="0.01"
            error={errors.pricePerNight}
            required
            disabled={isLoading}
          />
        </div>

        <Input
          label={t('admin.room.fields.description')}
          value={formData.description}
          onChange={handleInputChange('description')}
          placeholder={t('admin.room.placeholders.description')}
          error={errors.description}
          required
          disabled={isLoading}
        />

        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          error={errors.images}
          maxImages={5}
        />
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('admin.room.actions.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? t('admin.room.actions.saving') : (initialData ? t('admin.room.actions.update') : t('admin.room.actions.create'))}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;