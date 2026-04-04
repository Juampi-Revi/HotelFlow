package com.digitalhouse.hotelbooking.dto.response;

import com.digitalhouse.hotelbooking.model.enums.RoomType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class RoomResponseDTO {
    
    private Long id;
    private String roomNumber;
    private RoomType roomType;
    private Integer capacity;
    private BigDecimal pricePerNight;
    private String description;
    private List<String> images;
    private String hotelName;
    private String hotelChain;
    private BigDecimal hotelRating;
    private String city;
    private String country;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<String> amenities;
    private String viewType;
    private Integer floor;
    private BigDecimal sizeSqm;
    private Boolean hasBalcony;
    private Boolean hasWifi;
    private Boolean hasAirConditioning;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long categoryId;
    private String categorySlug;
    private String categoryName;
    private java.util.List<FeatureResponseDTO> features;
    private BigDecimal averageRating;
    private Long totalRatings;
    
    public RoomResponseDTO() {}
    
    public RoomResponseDTO(Long id, String roomNumber, RoomType roomType, Integer capacity, 
                          BigDecimal pricePerNight, String description, List<String> images,
                          String hotelName, String city, String country, Boolean isAvailable, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.description = description;
        this.images = images;
        this.hotelName = hotelName;
        this.city = city;
        this.country = country;
        this.isAvailable = isAvailable;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getRoomNumber() {
        return roomNumber;
    }
    
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
    
    public RoomType getRoomType() {
        return roomType;
    }
    
    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public BigDecimal getPricePerNight() {
        return pricePerNight;
    }
    
    public void setPricePerNight(BigDecimal pricePerNight) {
        this.pricePerNight = pricePerNight;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getImages() {
        return images;
    }
    
    public void setImages(List<String> images) {
        this.images = images;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public void setCategorySlug(String categorySlug) {
        this.categorySlug = categorySlug;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public java.util.List<FeatureResponseDTO> getFeatures() {
        return features;
    }

    public void setFeatures(java.util.List<FeatureResponseDTO> features) {
        this.features = features;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getHotelChain() {
        return hotelChain;
    }

    public void setHotelChain(String hotelChain) {
        this.hotelChain = hotelChain;
    }

    public BigDecimal getHotelRating() {
        return hotelRating;
    }

    public void setHotelRating(BigDecimal hotelRating) {
        this.hotelRating = hotelRating;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public String getViewType() {
        return viewType;
    }

    public void setViewType(String viewType) {
        this.viewType = viewType;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public BigDecimal getSizeSqm() {
        return sizeSqm;
    }

    public void setSizeSqm(BigDecimal sizeSqm) {
        this.sizeSqm = sizeSqm;
    }

    public Boolean getHasBalcony() {
        return hasBalcony;
    }

    public void setHasBalcony(Boolean hasBalcony) {
        this.hasBalcony = hasBalcony;
    }

    public Boolean getHasWifi() {
        return hasWifi;
    }

    public void setHasWifi(Boolean hasWifi) {
        this.hasWifi = hasWifi;
    }

    public Boolean getHasAirConditioning() {
        return hasAirConditioning;
    }

    public void setHasAirConditioning(Boolean hasAirConditioning) {
        this.hasAirConditioning = hasAirConditioning;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Long totalRatings) {
        this.totalRatings = totalRatings;
    }
}
