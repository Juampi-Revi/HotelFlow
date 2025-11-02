import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import Button from '../../atoms/Button/Button';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import ImageUpload from '../../molecules/ImageUpload/ImageUpload';
import { IconSelector } from '../../molecules';
import { useRoomForm } from '../../../hooks';
import { categoryService } from '../../../services/categoryService';
import { featureService } from '../../../services/featureService';

const RoomForm = ({ onSubmit, onCancel, initialData = null, isLoading = false, isEditMode = false }) => {
  const { t } = useTranslation();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '', description: '', isActive: true });
  const [featForm, setFeatForm] = useState({ name: '', icon: '', isActive: true });
  const [savingCat, setSavingCat] = useState(false);
  const [savingFeat, setSavingFeat] = useState(false);
  const [quickError, setQuickError] = useState('');
  
  const {
    formData,
    errors,
    roomTypeOptions,
    viewTypeOptions,
    hotelRatingOptions,
    amenitiesOptions,
    categoryOptions,
    featureOptions,
    handleInputChange,
    handleImagesChange,
    handleFeatureToggle,
    handleSubmit,
    reloadCategories,
    reloadFeatures
  } = useRoomForm(initialData, onSubmit);

  const isFieldDisabled = isLoading;

  const openCreateCategory = () => {
    setCatForm({ name: '', slug: '', description: '', isActive: true });
    setQuickError('');
    setShowCategoryModal(true);
  };
  const openCreateFeature = () => {
    setFeatForm({ name: '', icon: '', isActive: true });
    setQuickError('');
    setShowFeatureModal(true);
  };
  const closeCategoryModal = () => setShowCategoryModal(false);
  const closeFeatureModal = () => setShowFeatureModal(false);

  const handleCatChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCatForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveQuickCategory = async (e) => {
    e.preventDefault();
    try {
      setSavingCat(true);
      const created = await categoryService.createCategory(catForm);
      await reloadCategories();
      handleInputChange('categoryId')(created?.id ?? null);
      setShowCategoryModal(false);
    } catch (err) {
      setQuickError(t('admin.room.quickCreate.errors.categorySaveFailed'));
    } finally {
      setSavingCat(false);
    }
  };

  const saveQuickFeature = async (e) => {
    e.preventDefault();
    try {
      setSavingFeat(true);
      const created = await featureService.createFeature(featForm);
      await reloadFeatures();
      if (created?.isActive !== false) {
        handleFeatureToggle(created.id, true);
      }
      setShowFeatureModal(false);
    } catch (err) {
      setQuickError(t('admin.room.quickCreate.errors.featureSaveFailed'));
    } finally {
      setSavingFeat(false);
    }
  };

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
            onChange={(e) => handleInputChange('categoryId')(e.target.value ? Number(e.target.value) : null)}
            options={categoryOptions}
            placeholder={t('admin.room.placeholders.category')}
            error={errors.categoryId}
            disabled={isFieldDisabled}
          />
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="small" type="button" onClick={openCreateCategory}>
              {t('admin.room.quickCreate.addCategory')}
            </Button>
          </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('admin.room.sections.roomFeatures')}
            </h3>
            <Button variant="secondary" size="small" type="button" onClick={openCreateFeature}>
              {t('admin.room.quickCreate.addFeature')}
            </Button>
          </div>
          
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

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              {t('admin.features.sectionTitle')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {featureOptions.map(opt => (
                <Checkbox
                  key={opt.value}
                  label={opt.label}
                  checked={Array.isArray(formData.featureIds) && formData.featureIds.includes(opt.value)}
                  onChange={(checked) => handleFeatureToggle(opt.value, checked)}
                  disabled={isFieldDisabled}
                />
              ))}
              {featureOptions.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('admin.features.empty')}
                </p>
              )}
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

      {/* Category Quick Create Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justifyCenter z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('admin.room.quickCreate.categoryForm.title')}
              </h2>
              <Button variant="secondary" size="small" onClick={closeCategoryModal}>✕</Button>
            </div>
            {quickError && (
              <div className="mx-6 mt-3 p-3 border border-red-300 bg-red-50 text-red-700 rounded">{quickError}</div>
            )}
            <form onSubmit={saveQuickCategory} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.name')}</label>
                <input name="name" value={catForm.name} onChange={handleCatChange} required className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.slug')}</label>
                <input name="slug" value={catForm.slug} onChange={handleCatChange} required className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.categories.form.description')}</label>
                <textarea name="description" value={catForm.description} onChange={handleCatChange} rows="3" className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="flex items-center gap-2">
                <input id="catIsActive" type="checkbox" name="isActive" checked={catForm.isActive} onChange={handleCatChange} />
                <label htmlFor="catIsActive" className="text-sm text-gray-700 dark:text-gray-300">{t('admin.categories.form.isActive')}</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={closeCategoryModal}>{t('admin.categories.form.cancel')}</Button>
                <Button variant="primary" type="submit" disabled={savingCat}>{savingCat ? t('admin.categories.form.saving') : t('admin.categories.form.save')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature Quick Create Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justifyCenter z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('admin.room.quickCreate.featureForm.title')}
              </h2>
              <Button variant="secondary" size="small" onClick={closeFeatureModal}>✕</Button>
            </div>
            {quickError && (
              <div className="mx-6 mt-3 p-3 border border-red-300 bg-red-50 text-red-700 rounded">{quickError}</div>
            )}
            <form onSubmit={saveQuickFeature} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.features.form.name')}</label>
                <input name="name" value={featForm.name} onChange={(e) => setFeatForm(prev => ({ ...prev, name: e.target.value }))} required className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.features.form.icon')}</label>
                <IconSelector value={featForm.icon} onChange={(token) => setFeatForm(prev => ({ ...prev, icon: token }))} />
              </div>
              <div className="flex items-center gap-2">
                <input id="featIsActive" type="checkbox" name="isActive" checked={featForm.isActive} onChange={(e) => setFeatForm(prev => ({ ...prev, isActive: e.target.checked }))} />
                <label htmlFor="featIsActive" className="text-sm text-gray-700 dark:text-gray-300">{t('admin.features.form.isActive')}</label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={closeFeatureModal}>{t('admin.features.form.cancel')}</Button>
                <Button variant="primary" type="submit" disabled={savingFeat}>{savingFeat ? t('admin.features.form.saving') : t('admin.features.form.save')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </form>
  );
};

export default RoomForm;