import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook that encapsulates Room form validation using i18n messages.
 * Returns a `validate(formData)` function that produces `{ valid, errors }`.
 */
const useRoomFormValidation = () => {
  const { t } = useTranslation();

  const validate = useCallback((formData) => {
    const errors = {};

    if (!String(formData.roomNumber || '').trim()) {
      errors.roomNumber = t('admin.room.validation.roomNumberRequired');
    }

    if (!formData.roomType) {
      errors.roomType = t('admin.room.validation.roomTypeRequired');
    }

    if (!formData.capacity || Number(formData.capacity) < 1) {
      errors.capacity = t('admin.room.validation.capacityMinimum');
    }

    if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0) {
      errors.pricePerNight = t('admin.room.validation.priceRequired');
    }

    if (!String(formData.description || '').trim()) {
      errors.description = t('admin.room.validation.descriptionRequired');
    }

    if (!Array.isArray(formData.images) || formData.images.length === 0) {
      errors.images = t('admin.room.validation.imagesRequired');
    }

    if (!String(formData.hotelName || '').trim()) {
      errors.hotelName = t('admin.room.validation.hotelNameRequired');
    }

    if (!String(formData.city || '').trim()) {
      errors.city = t('admin.room.validation.cityRequired');
    }

    if (!String(formData.country || '').trim()) {
      errors.country = t('admin.room.validation.countryRequired');
    }

    if (!String(formData.address || '').trim()) {
      errors.address = t('admin.room.validation.addressRequired');
    }

    if (formData.hotelRating && (Number(formData.hotelRating) < 1 || Number(formData.hotelRating) > 5)) {
      errors.hotelRating = t('admin.room.validation.hotelRatingRange');
    }

    if (formData.floor && Number(formData.floor) < 0) {
      errors.floor = t('admin.room.validation.floorMinimum');
    }

    if (formData.sizeSqm && Number(formData.sizeSqm) <= 0) {
      errors.sizeSqm = t('admin.room.validation.sizeSqmMinimum');
    }

    if (formData.latitude && (Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      errors.latitude = t('admin.room.validation.latitudeRange');
    }

    if (formData.longitude && (Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      errors.longitude = t('admin.room.validation.longitudeRange');
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }, [t]);

  return { validate };
};

export default useRoomFormValidation;