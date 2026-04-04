package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    Optional<Room> findByRoomNumber(String roomNumber);
    
    boolean existsByRoomNumber(String roomNumber);
    
    List<Room> findByRoomType(RoomType roomType);
    
    List<Room> findByIsAvailable(Boolean isAvailable);
    
    @Query("SELECT r FROM Room r WHERE r.capacity >= :minCapacity")
    List<Room> findByMinCapacity(@Param("minCapacity") Integer minCapacity);
    
    @Query("SELECT r FROM Room r WHERE r.isAvailable = true ORDER BY r.pricePerNight ASC")
    List<Room> findAvailableRoomsOrderByPrice();

    List<Room> findByCategory_Id(Long categoryId);
    List<Room> findByCategory_Slug(String categorySlug);
    boolean existsByCategory_Id(Long categoryId);
    
    // Added: paginated fetch by multiple category ids
    Page<Room> findByCategory_IdIn(List<Long> categoryIds, Pageable pageable);
    
    @Query("SELECT r FROM Room r WHERE " +
           "(:destination IS NULL OR :destination = '' OR " +
           " LOWER(r.city) LIKE LOWER(CONCAT('%', :destination, '%')) OR " +
           " LOWER(r.country) LIKE LOWER(CONCAT('%', :destination, '%')) OR " +
           " LOWER(r.hotelName) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:minPrice IS NULL OR r.pricePerNight >= :minPrice) AND " +
           "(:maxPrice IS NULL OR r.pricePerNight <= :maxPrice) AND " +
           "(:roomType IS NULL OR r.roomType = :roomType) AND " +
           "(:categoryIds IS NULL OR r.category.id IN :categoryIds) AND " +
           "(:checkIn IS NULL OR :checkOut IS NULL OR NOT EXISTS (" +
           "  SELECT b.id FROM Booking b WHERE b.room = r " +
           "  AND b.status = 'CONFIRMED' " +
           "  AND b.checkInDate < :checkOut " +
           "  AND b.checkOutDate > :checkIn" +
           ")) AND " +
           "r.isAvailable = true")
    Page<Room> searchRooms(@Param("destination") String destination,
                          @Param("minCapacity") Integer minCapacity,
                          @Param("minPrice") BigDecimal minPrice,
                          @Param("maxPrice") BigDecimal maxPrice,
                          @Param("roomType") RoomType roomType,
                          @Param("categoryIds") List<Long> categoryIds,
                          @Param("checkIn") LocalDate checkIn,
                          @Param("checkOut") LocalDate checkOut,
                          Pageable pageable);
    
    @Query("SELECT DISTINCT r.city FROM Room r WHERE " +
           "LOWER(r.city) LIKE LOWER(CONCAT('%', :query, '%')) AND " +
           "r.isAvailable = true " +
           "ORDER BY r.city")
    List<String> findCitiesByQuery(@Param("query") String query);
    
    @Query("SELECT DISTINCT r.country FROM Room r WHERE " +
           "LOWER(r.country) LIKE LOWER(CONCAT('%', :query, '%')) AND " +
           "r.isAvailable = true " +
           "ORDER BY r.country")
    List<String> findCountriesByQuery(@Param("query") String query);
    
    @Query("SELECT DISTINCT r.hotelName FROM Room r WHERE " +
           "LOWER(r.hotelName) LIKE LOWER(CONCAT('%', :query, '%')) AND " +
           "r.isAvailable = true " +
           "ORDER BY r.hotelName")
    List<String> findHotelsByQuery(@Param("query") String query);
}
