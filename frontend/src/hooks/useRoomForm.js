import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../services/categoryService';
import { featureService } from '../services/featureService';
import useRoomFormValidation from './useRoomFormValidation';

/**
 * useRoomForm
 * Manages room form state, options, validation, and submission.
 */
const useRoomForm = (initialData = null, onSubmit) => {
  const { t } = useTranslation();
  const { validate } = useRoomFormValidation();

  const [formData, setFormData] = useState({
    roomNumber: initialData?.roomNumber || '',
    roomType: initialData?.roomType || '',
    capacity: initialData?.capacity || '',
    pricePerNight: initialData?.pricePerNight || '',
    description: initialData?.description || '',
    images: initialData?.images || [],
    categoryId: initialData?.categoryId || null,
    
    hotelName: initialData?.hotelName || '',
    hotelChain: initialData?.hotelChain || '',
    hotelRating: initialData?.hotelRating || '',
    
    city: initialData?.city || '',
    country: initialData?.country || '',
    address: initialData?.address || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    
    viewType: initialData?.viewType || '',
    floor: initialData?.floor || '',
    sizeSqm: initialData?.sizeSqm || '',
    
    hasBalcony: initialData?.hasBalcony || false,
    hasWifi: initialData?.hasWifi !== undefined ? initialData.hasWifi : true,
    hasAirConditioning: initialData?.hasAirConditioning !== undefined ? initialData.hasAirConditioning : true,
    
    amenities: initialData?.amenities || [],
    featureIds: initialData?.features?.map(f => f.id) || []
  });

  const [errors, setErrors] = useState({});

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);

  const roomTypeOptions = useMemo(() => ([
    { value: 'SINGLE', label: t('admin.room.types.single') },
    { value: 'DOUBLE', label: t('admin.room.types.double') },
    { value: 'SUITE', label: t('admin.room.types.suite') },
    { value: 'FAMILY', label: t('admin.room.types.family') },
    { value: 'DELUXE', label: t('admin.room.types.deluxe') }
  ]), [t]);

  const viewTypeOptions = useMemo(() => ([
    { value: 'ocean', label: t('admin.room.viewTypes.ocean') },
    { value: 'mountain', label: t('admin.room.viewTypes.mountain') },
    { value: 'city', label: t('admin.room.viewTypes.city') },
    { value: 'garden', label: t('admin.room.viewTypes.garden') },
    { value: 'pool', label: t('admin.room.viewTypes.pool') },
    { value: 'courtyard', label: t('admin.room.viewTypes.courtyard') }
  ]), [t]);

  const hotelRatingOptions = useMemo(() => ([
    { value: 1, label: '1 ⭐' },
    { value: 2, label: '2 ⭐⭐' },
    { value: 3, label: '3 ⭐⭐⭐' },
    { value: 4, label: '4 ⭐⭐⭐⭐' },
    { value: 5, label: '5 ⭐⭐⭐⭐⭐' }
  ]), []);

  const amenitiesOptions = useMemo(() => ([
    { value: 'wifi', label: t('admin.room.amenities.wifi') },
    { value: 'tv', label: t('admin.room.amenities.tv') },
    { value: 'minibar', label: t('admin.room.amenities.minibar') },
    { value: 'safe', label: t('admin.room.amenities.safe') },
    { value: 'roomService', label: t('admin.room.amenities.roomService') },
    { value: 'laundry', label: t('admin.room.amenities.laundry') },
    { value: 'parking', label: t('admin.room.amenities.parking') },
    { value: 'gym', label: t('admin.room.amenities.gym') },
    { value: 'spa', label: t('admin.room.amenities.spa') },
    { value: 'pool', label: t('admin.room.amenities.pool') }
  ]), [t]);

  const reloadCategories = useCallback(async () => {
    try {
      const categories = await categoryService.getAllCategories();
      const activeCategories = categories.filter(c => c.isActive !== false);
      setCategoryOptions(activeCategories.map(c => ({ value: c.id, label: c.name })));
    } catch (err) {
      setCategoryOptions([]);
    }
  }, []);

  const reloadFeatures = useCallback(async () => {
    try {
      const features = await featureService.getActiveFeatures();
      const activeFeatures = features.filter(f => f.isActive !== false);
      setFeatureOptions(activeFeatures.map(f => ({ value: f.id, label: f.name, icon: f.icon })));
    } catch (err) {
      setFeatureOptions([]);
    }
  }, []);

  useEffect(() => { reloadCategories(); }, [reloadCategories]);
  useEffect(() => { reloadFeatures(); }, [reloadFeatures]);

  const validateForm = useCallback(() => {
    const { valid, errors: nextErrors } = validate(formData);
    setErrors(nextErrors);
    return valid;
  }, [formData, validate]);

  const handleInputChange = (field) => (eOrValue) => {
    const isEvent = eOrValue && typeof eOrValue === 'object' && 'target' in eOrValue;
    const value = isEvent
      ? (eOrValue.target.type === 'checkbox' ? eOrValue.target.checked : eOrValue.target.value)
      : eOrValue;

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));

    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  const handleFeatureToggle = (id, checked) => {
    setFormData(prev => {
      const nextIds = new Set(prev.featureIds);
      if (checked) {
        nextIds.add(id);
      } else {
        nextIds.delete(id);
      }
      return { ...prev, featureIds: Array.from(nextIds) };
    });
    if (errors.featureIds) {
      setErrors(prev => ({ ...prev, featureIds: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        pricePerNight: parseFloat(formData.pricePerNight)
      };
      onSubmit(submitData);
    }
  };

  const resetForm = () => {
    setFormData({
      roomNumber: '',
      roomType: '',
      capacity: '',
      pricePerNight: '',
      description: '',
      images: [],
      categoryId: null,
      hotelName: '',
      hotelChain: '',
      hotelRating: '',
      city: '',
      country: '',
      address: '',
      latitude: '',
      longitude: '',
      viewType: '',
      floor: '',
      sizeSqm: '',
      hasBalcony: false,
      hasWifi: true,
      hasAirConditioning: true,
      amenities: [],
      featureIds: []
    });
    setErrors({});
  };

  return {
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
    resetForm,
    validateForm,
    reloadCategories,
    reloadFeatures
  };
};

export default useRoomForm;