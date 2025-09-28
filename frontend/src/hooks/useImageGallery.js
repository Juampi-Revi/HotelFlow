import { useState } from 'react';

const useImageGallery = (images = []) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const displayImages = images.slice(0, 5);
  const mainImage = displayImages[0];
  const gridImages = displayImages.slice(1, 5);
  const hasMoreImages = images.length > 5;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleViewMore = () => {
    setIsModalOpen(true);
    setModalImageIndex(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setModalImageIndex(index);
  };

  return {
    selectedImageIndex,
    isModalOpen,
    modalImageIndex,
    displayImages,
    mainImage,
    gridImages,
    hasMoreImages,
    handleImageClick,
    handleViewMore,
    closeModal,
    nextImage,
    prevImage,
    goToImage
  };
};

export default useImageGallery;