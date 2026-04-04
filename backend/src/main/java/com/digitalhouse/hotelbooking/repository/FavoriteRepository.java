package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.Favorite;
import com.digitalhouse.hotelbooking.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUser_IdAndRoom_Id(Long userId, Long roomId);
    List<Favorite> findAllByUser_Id(Long userId);
    void deleteByUser_IdAndRoom_Id(Long userId, Long roomId);

    @Query("SELECT f.room FROM Favorite f WHERE f.user.id = :userId")
    List<Room> findRoomsByUserId(@Param("userId") Long userId);
}
