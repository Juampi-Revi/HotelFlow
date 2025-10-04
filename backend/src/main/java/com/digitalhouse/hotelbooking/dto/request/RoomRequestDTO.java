package com.digitalhouse.hotelbooking.dto.request;

import com.digitalhouse.hotelbooking.model.enums.RoomType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class RoomRequestDTO {
    
    @NotBlank(message = "Room number is required")
    private String roomNumber;
    
    @NotNull(message = "Room type is required")
    private RoomType roomType;
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Max(value = 10, message = "Capacity cannot exceed 10")
    private Integer capacity;
    
    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal pricePerNight;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    private List<String> images;
    
    @NotBlank(message = "Hotel name is required")
    private String hotelName;
    
    private String hotelChain;
    
    @DecimalMin(value = "1.0", message = "Hotel rating must be at least 1.0")
    @DecimalMax(value = "5.0", message = "Hotel rating cannot exceed 5.0")
    private BigDecimal hotelRating;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    private String address;
    
    private BigDecimal latitude;
    
    private BigDecimal longitude;
    
    private List<String> amenities;
    
    private String viewType;
    
    @Min(value = 1, message = "Floor must be at least 1")
    private Integer floor;
    
    @DecimalMin(value = "10.0", message = "Room size must be at least 10 square meters")
    private BigDecimal sizeSqm;
    
    private Boolean hasBalcony;
    
    private Boolean hasWifi;
    
    private Boolean hasAirConditioning;

    private Long categoryId;
    
    public RoomRequestDTO() {}
    
    public RoomRequestDTO(String roomNumber, RoomType roomType, Integer capacity, BigDecimal pricePerNight, 
                         String description, List<String> images, String hotelName, String city, String country) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.description = description;
        this.images = images;
        this.hotelName = hotelName;
        this.city = city;
        this.country = country;
        this.hasWifi = true;
        this.hasAirConditioning = true;
        this.hasBalcony = false;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}