import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  error,
  disabled = false
}) => {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files) => {
    if (disabled) return;
    
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target.result;
          onImagesChange([...images, base64]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    if (!disabled) {
      setDragOver(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const removeImage = (index) => {
    if (disabled) return;
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const dropzoneClasses = `
    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
    ${disabled 
      ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700' 
      : dragOver 
        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 cursor-pointer' 
        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500 cursor-pointer'
    }
    ${images.length >= maxImages && !disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t('admin.room.fields.images')}
        <span className="text-gray-500 ml-2">({images.length}/{maxImages})</span>
      </label>

      <div
        className={dropzoneClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled || images.length >= maxImages}
        />
        <div className="flex flex-col items-center gap-2">
          <svg 
            className="w-12 h-12 text-gray-400 dark:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">{t('admin.room.imageUpload.dropText')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {t('admin.room.imageUpload.formatHint', { maxImages })}
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Room ${index + 1}`} 
                className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <Button
                variant="danger"
                size="small"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                title={t('admin.room.imageUpload.removeImage')}
                disabled={disabled}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default ImageUpload;