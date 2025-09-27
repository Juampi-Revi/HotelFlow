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
    
    public RoomRequestDTO() {}
    
    public RoomRequestDTO(String roomNumber, RoomType roomType, Integer capacity, BigDecimal pricePerNight, String description, List<String> images) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.capacity = capacity;
        this.pricePerNight = pricePerNight;
        this.description = description;
        this.images = images;
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
}