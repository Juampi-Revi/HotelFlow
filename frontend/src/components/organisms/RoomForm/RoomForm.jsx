import { useTranslation } from 'react-i18next';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import Button from '../../atoms/Button/Button';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import ImageUpload from '../../molecules/ImageUpload/ImageUpload';
import { useRoomForm } from '../../../hooks';

const RoomForm = ({ onSubmit, onCancel, initialData = null, isLoading = false, isEditMode = false }) => {
  const { t } = useTranslation();
  
  const {
    formData,
    errors,
    roomTypeOptions,
    viewTypeOptions,
    hotelRatingOptions,
    amenitiesOptions,
    categoryOptions,
    handleInputChange,
    handleImagesChange,
    handleSubmit
  } = useRoomForm(initialData, onSubmit);

  const isFieldDisabled = isLoading;

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
            disabled={isFieldDisabled}
          />

          <Select
            label={t('admin.room.fields.roomType')}
            value={formData.roomType}
            onChange={handleInputChange('roomType')}
            options={roomTypeOptions}
            placeholder={t('admin.room.placeholders.roomType')}
            error={errors.roomType}
            required
            disabled={isFieldDisabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t('admin.room.fields.category')}
            value={formData.categoryId ?? ''}
            onChange={handleInputChange('categoryId')}
            options={categoryOptions}
            placeholder={t('admin.room.placeholders.category')}
            error={errors.categoryId}
            disabled={isFieldDisabled}
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
            disabled={isFieldDisabled}
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
            disabled={isFieldDisabled}
          />
        </div>

        <Input
          label={t('admin.room.fields.description')}
          value={formData.description}
          onChange={handleInputChange('description')}
          placeholder={t('admin.room.placeholders.description')}
          error={errors.description}
          required
          disabled={isFieldDisabled}
        />

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('admin.room.sections.hotelInfo')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('admin.room.fields.hotelName')}
              value={formData.hotelName}
              onChange={handleInputChange('hotelName')}
              placeholder={t('admin.room.placeholders.hotelName')}
              error={errors.hotelName}
              required
              disabled={isFieldDisabled}
            />

            <Input
              label={t('admin.room.fields.hotelChain')}
              value={formData.hotelChain}
              onChange={handleInputChange('hotelChain')}
              placeholder={t('admin.room.placeholders.hotelChain')}
              error={errors.hotelChain}
              disabled={isFieldDisabled}
            />

            <Select
              label={t('admin.room.fields.hotelRating')}
              value={formData.hotelRating}
              onChange={handleInputChange('hotelRating')}
              options={hotelRatingOptions}
              placeholder={t('admin.room.placeholders.hotelRating')}
              error={errors.hotelRating}
              disabled={isFieldDisabled}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('admin.room.sections.location')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('admin.room.fields.city')}
              value={formData.city}
              onChange={handleInputChange('city')}
              placeholder={t('admin.room.placeholders.city')}
              error={errors.city}
              required
              disabled={isFieldDisabled}
            />

            <Input
              label={t('admin.room.fields.country')}
              value={formData.country}
              onChange={handleInputChange('country')}
              placeholder={t('admin.room.placeholders.country')}
              error={errors.country}
              required
              disabled={isFieldDisabled}
            />

            <div className="md:col-span-2">
              <Input
                label={t('admin.room.fields.address')}
                value={formData.address}
                onChange={handleInputChange('address')}
                placeholder={t('admin.room.placeholders.address')}
                error={errors.address}
                required
                disabled={isFieldDisabled}
              />
            </div>

            <Input
              label={t('admin.room.fields.latitude')}
              type="number"
              value={formData.latitude}
              onChange={handleInputChange('latitude')}
              placeholder={t('admin.room.placeholders.latitude')}
              error={errors.latitude}
              step="0.000001"
              min="-90"
              max="90"
              disabled={isFieldDisabled}
            />

            <Input
              label={t('admin.room.fields.longitude')}
              type="number"
              value={formData.longitude}
              onChange={handleInputChange('longitude')}
              placeholder={t('admin.room.placeholders.longitude')}
              error={errors.longitude}
              step="0.000001"
              min="-180"
              max="180"
              disabled={isFieldDisabled}
            />
          </div>
        </div>

        {/* Características de la Habitación */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('admin.room.sections.roomFeatures')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label={t('admin.room.fields.viewType')}
              value={formData.viewType}
              onChange={handleInputChange('viewType')}
              options={viewTypeOptions}
              placeholder={t('admin.room.placeholders.viewType')}
              error={errors.viewType}
              disabled={isFieldDisabled}
            />

            <Input
              label={t('admin.room.fields.floor')}
              type="number"
              value={formData.floor}
              onChange={handleInputChange('floor')}
              placeholder={t('admin.room.placeholders.floor')}
              error={errors.floor}
              min="0"
              disabled={isFieldDisabled}
            />

            <Input
              label={t('admin.room.fields.sizeSqm')}
              type="number"
              value={formData.sizeSqm}
              onChange={handleInputChange('sizeSqm')}
              placeholder={t('admin.room.placeholders.sizeSqm')}
              error={errors.sizeSqm}
              min="1"
              step="0.1"
              disabled={isFieldDisabled}
            />
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              {t('admin.room.sections.basicAmenities')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox
                label={t('admin.room.fields.hasWifi')}
                checked={formData.hasWifi}
                onChange={(checked) => handleInputChange('hasWifi')(checked)}
                disabled={isFieldDisabled}
              />

              <Checkbox
                label={t('admin.room.fields.hasAirConditioning')}
                checked={formData.hasAirConditioning}
                onChange={(checked) => handleInputChange('hasAirConditioning')(checked)}
                disabled={isFieldDisabled}
              />

              <Checkbox
                label={t('admin.room.fields.hasBalcony')}
                checked={formData.hasBalcony}
                onChange={(checked) => handleInputChange('hasBalcony')(checked)}
                disabled={isFieldDisabled}
              />
            </div>
          </div>
        </div>

        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          error={errors.images}
          maxImages={5}
          disabled={isFieldDisabled}
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