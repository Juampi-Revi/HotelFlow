package com.digitalhouse.hotelbooking.dto.response;

import java.time.LocalDateTime;

public class RoomReviewResponseDTO {

    private Long id;
    private Integer rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;

    public RoomReviewResponseDTO() {}

    public RoomReviewResponseDTO(Long id, Integer rating, String comment, String userName, LocalDateTime createdAt) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.userName = userName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

