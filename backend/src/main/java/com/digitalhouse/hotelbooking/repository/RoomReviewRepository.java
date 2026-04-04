package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.RoomReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomReviewRepository extends JpaRepository<RoomReview, Long> {

    List<RoomReview> findByRoom_IdOrderByCreatedAtDesc(Long roomId);

    boolean existsByRoom_IdAndUser_Id(Long roomId, Long userId);

    Optional<RoomReview> findByRoom_IdAndUser_Id(Long roomId, Long userId);

    interface RoomRatingSummary {
        Double getAverageRating();
        Long getTotalRatings();
    }

    @Query("SELECT AVG(r.rating) as averageRating, COUNT(r) as totalRatings FROM RoomReview r WHERE r.room.id = :roomId")
    RoomRatingSummary getRatingSummary(@Param("roomId") Long roomId);
}
