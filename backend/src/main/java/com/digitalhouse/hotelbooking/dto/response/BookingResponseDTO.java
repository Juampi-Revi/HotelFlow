package com.digitalhouse.hotelbooking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponseDTO {

    private Long id;
    private Long roomId;
    private String roomNumber;
    private String hotelName;
    private String city;
    private String country;
    private String imageUrl;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfGuests;
    private BigDecimal totalPrice;
    private String status;
    private String specialRequests;
    private LocalDateTime createdAt;
    private Boolean notificationEmailSent;
    private String notificationEmailMessage;

    public BookingResponseDTO() {}

    public BookingResponseDTO(Long id, Long roomId, String roomNumber, String hotelName, String city, String country,
                              String imageUrl, LocalDate checkInDate, LocalDate checkOutDate, Integer numberOfGuests,
                              BigDecimal totalPrice, String status, String specialRequests, LocalDateTime createdAt) {
        this.id = id;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.hotelName = hotelName;
        this.city = city;
        this.country = country;
        this.imageUrl = imageUrl;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfGuests = numberOfGuests;
        this.totalPrice = totalPrice;
        this.status = status;
        this.specialRequests = specialRequests;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSpecialRequests() {
        return specialRequests;
    }

    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getNotificationEmailSent() {
        return notificationEmailSent;
    }

    public void setNotificationEmailSent(Boolean notificationEmailSent) {
        this.notificationEmailSent = notificationEmailSent;
    }

    public String getNotificationEmailMessage() {
        return notificationEmailMessage;
    }

    public void setNotificationEmailMessage(String notificationEmailMessage) {
        this.notificationEmailMessage = notificationEmailMessage;
    }
}
