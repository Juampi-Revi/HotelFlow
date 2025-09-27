import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useRoomForm = (initialData = null, onSubmit) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    roomNumber: initialData?.roomNumber || '',
    roomType: initialData?.roomType || '',
    capacity: initialData?.capacity || '',
    pricePerNight: initialData?.pricePerNight || '',
    description: initialData?.description || '',
    images: initialData?.images || []
  });

  const [errors, setErrors] = useState({});

  const roomTypeOptions = [
    { value: 'SINGLE', label: t('admin.room.types.single') },
    { value: 'DOUBLE', label: t('admin.room.types.double') },
    { value: 'SUITE', label: t('admin.room.types.suite') },
    { value: 'FAMILY', label: t('admin.room.types.family') },
    { value: 'DELUXE', label: t('admin.room.types.deluxe') }
  ];

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
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
      images: []
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    roomTypeOptions,
    
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    resetForm,
    validateForm
  };
};

export default useRoomForm;