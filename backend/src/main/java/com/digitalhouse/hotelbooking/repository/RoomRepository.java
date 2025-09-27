package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}