package com.digitalhouse.hotelbooking.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class RoomReviewSummaryResponseDTO {

    private Long roomId;
    private BigDecimal averageRating;
    private Long totalRatings;
    private List<RoomReviewResponseDTO> reviews;

    public RoomReviewSummaryResponseDTO() {}

    public RoomReviewSummaryResponseDTO(Long roomId, BigDecimal averageRating, Long totalRatings, List<RoomReviewResponseDTO> reviews) {
        this.roomId = roomId;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
        this.reviews = reviews;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
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

    public List<RoomReviewResponseDTO> getReviews() {
        return reviews;
    }

    public void setReviews(List<RoomReviewResponseDTO> reviews) {
        this.reviews = reviews;
    }
}

