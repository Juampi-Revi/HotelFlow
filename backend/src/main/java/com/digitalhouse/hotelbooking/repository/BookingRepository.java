package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.Booking;
import com.digitalhouse.hotelbooking.model.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    /**
     * Find all bookings for a specific room
     */
    List<Booking> findByRoom_Id(Long roomId);
    
    /**
     * Find all bookings for a specific user
     */
    List<Booking> findByUser_Id(Long userId);

    List<Booking> findByUser_IdOrderByCheckInDateDesc(Long userId);

    Optional<Booking> findByIdAndUser_Id(Long id, Long userId);
    
    /**
     * Find bookings by status
     */
    List<Booking> findByStatus(BookingStatus status);
    
    /**
     * Check if a room is available for the given date range
     * Returns true if there are NO conflicting bookings
     */
    @Query("SELECT CASE WHEN COUNT(b) = 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.status = 'CONFIRMED' " +
           "AND NOT (b.checkOutDate <= :checkInDate OR b.checkInDate >= :checkOutDate)")
    boolean isRoomAvailable(@Param("roomId") Long roomId, 
                           @Param("checkInDate") LocalDate checkInDate, 
                           @Param("checkOutDate") LocalDate checkOutDate);
    
    /**
     * Get all occupied date ranges for a specific room
     * This will be used to display unavailable dates in the calendar
     */
    @Query("SELECT b FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.checkOutDate > :startDate " +
           "AND b.checkInDate < :endDate " +
           "ORDER BY b.checkInDate")
    List<Booking> findOccupiedDateRanges(@Param("roomId") Long roomId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);
    
    /**
     * Get all confirmed bookings for a room within a date range
     */
    @Query("SELECT b FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.status = 'CONFIRMED' " +
           "AND ((b.checkInDate BETWEEN :startDate AND :endDate) " +
           "OR (b.checkOutDate BETWEEN :startDate AND :endDate) " +
           "OR (b.checkInDate <= :startDate AND b.checkOutDate >= :endDate))")
    List<Booking> findBookingsInDateRange(@Param("roomId") Long roomId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
    
    /**
     * Find bookings that overlap with the given date range for a specific room
     */
    @Query("SELECT b FROM Booking b " +
           "WHERE b.room.id = :roomId " +
           "AND b.status IN ('CONFIRMED') " +
           "AND b.checkInDate < :checkOutDate " +
           "AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId,
                                         @Param("checkInDate") LocalDate checkInDate,
                                         @Param("checkOutDate") LocalDate checkOutDate);
    
    /**
     * Get upcoming bookings for a user
     */
    @Query("SELECT b FROM Booking b " +
           "WHERE b.user.id = :userId " +
           "AND b.checkInDate >= :currentDate " +
           "AND b.status = 'CONFIRMED' " +
           "ORDER BY b.checkInDate")
    List<Booking> findUpcomingBookingsByUser(@Param("userId") Long userId, 
                                            @Param("currentDate") LocalDate currentDate);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
            "WHERE b.room.id = :roomId " +
            "AND b.user.id = :userId " +
            "AND b.status <> 'CANCELLED' " +
            "AND b.checkOutDate < :today")
    boolean hasCompletedStay(@Param("roomId") Long roomId,
                             @Param("userId") Long userId,
                             @Param("today") LocalDate today);
}
