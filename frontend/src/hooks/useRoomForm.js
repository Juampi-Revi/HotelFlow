import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../services/categoryService';
import { featureService } from '../services/featureService';

const useRoomForm = (initialData = null, onSubmit) => {
  const { t } = useTranslation();

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
    // Features (IDs)
    featureIds: initialData?.features?.map(f => f.id) || []
  });

  const [errors, setErrors] = useState({});

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [featureOptions, setFeatureOptions] = useState([]);

  const roomTypeOptions = [
    { value: 'SINGLE', label: t('admin.room.types.single') },
    { value: 'DOUBLE', label: t('admin.room.types.double') },
    { value: 'SUITE', label: t('admin.room.types.suite') },
    { value: 'FAMILY', label: t('admin.room.types.family') },
    { value: 'DELUXE', label: t('admin.room.types.deluxe') }
  ];

  const viewTypeOptions = [
    { value: 'ocean', label: t('admin.room.viewTypes.ocean') },
    { value: 'mountain', label: t('admin.room.viewTypes.mountain') },
    { value: 'city', label: t('admin.room.viewTypes.city') },
    { value: 'garden', label: t('admin.room.viewTypes.garden') },
    { value: 'pool', label: t('admin.room.viewTypes.pool') },
    { value: 'courtyard', label: t('admin.room.viewTypes.courtyard') }
  ];

  const hotelRatingOptions = [
    { value: 1, label: '1 ⭐' },
    { value: 2, label: '2 ⭐⭐' },
    { value: 3, label: '3 ⭐⭐⭐' },
    { value: 4, label: '4 ⭐⭐⭐⭐' },
    { value: 5, label: '5 ⭐⭐⭐⭐⭐' }
  ];

  const amenitiesOptions = [
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
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await categoryService.getAllCategories();
        const activeCategories = categories.filter(c => c.isActive !== false);
        setCategoryOptions(
          activeCategories.map(c => ({ value: c.id, label: c.name }))
        );
      } catch (err) {
        setCategoryOptions([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const features = await featureService.getActiveFeatures();
        const activeFeatures = features.filter(f => f.isActive !== false);
        setFeatureOptions(activeFeatures.map(f => ({ value: f.id, label: f.name, icon: f.icon })));
      } catch (err) {
        setFeatureOptions([]);
      }
    };
    loadFeatures();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = t('admin.room.validation.roomNumberRequired');
    }

    if (!formData.roomType) {
      newErrors.roomType = t('admin.room.validation.roomTypeRequired');
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = t('admin.room.validation.capacityMinimum');
    }

    if (!formData.pricePerNight || formData.pricePerNight <= 0) {
      newErrors.pricePerNight = t('admin.room.validation.priceRequired');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('admin.room.validation.descriptionRequired');
    }

    if (formData.images.length === 0) {
      newErrors.images = t('admin.room.validation.imagesRequired');
    }

    // Hotel information validations
    if (!formData.hotelName.trim()) {
      newErrors.hotelName = t('admin.room.validation.hotelNameRequired');
    }

    if (!formData.city.trim()) {
      newErrors.city = t('admin.room.validation.cityRequired');
    }

    if (!formData.country.trim()) {
      newErrors.country = t('admin.room.validation.countryRequired');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('admin.room.validation.addressRequired');
    }

    // Optional numeric validations
    if (formData.hotelRating && (formData.hotelRating < 1 || formData.hotelRating > 5)) {
      newErrors.hotelRating = t('admin.room.validation.hotelRatingRange');
    }

    if (formData.floor && formData.floor < 0) {
      newErrors.floor = t('admin.room.validation.floorMinimum');
    }

    if (formData.sizeSqm && formData.sizeSqm <= 0) {
      newErrors.sizeSqm = t('admin.room.validation.sizeSqmMinimum');
    }

    // Coordinate validations
    if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = t('admin.room.validation.latitudeRange');
    }

    if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = t('admin.room.validation.longitudeRange');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      // Basic fields
      roomNumber: '',
      roomType: '',
      capacity: '',
      pricePerNight: '',
      description: '',
      images: [],
      // Category
      categoryId: null,
      
      // Hotel information
      hotelName: '',
      hotelChain: '',
      hotelRating: '',
      
      // Location
      city: '',
      country: '',
      address: '',
      latitude: '',
      longitude: '',
      
      // Room features
      viewType: '',
      floor: '',
      sizeSqm: '',
      
      // Amenities (checkboxes)
      hasBalcony: false,
      hasWifi: true,
      hasAirConditioning: true,
      
      // Additional amenities (list)
      amenities: [],
      
      // Features
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
    validateForm
  };
};

export default useRoomForm;