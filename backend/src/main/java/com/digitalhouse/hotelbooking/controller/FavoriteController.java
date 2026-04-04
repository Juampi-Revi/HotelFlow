package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"}, allowCredentials = "true")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<Long>> getFavorites() {
        List<Long> ids = favoriteService.listFavoriteRoomIdsForCurrentUser();
        return ResponseEntity.ok(ids);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomResponseDTO>> getFavoriteRooms() {
        List<RoomResponseDTO> rooms = favoriteService.listFavoriteRoomsForCurrentUser();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/{roomId}")
    public ResponseEntity<Map<String, Object>> addFavorite(@PathVariable Long roomId) {
        favoriteService.addFavorite(roomId);
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("roomId", roomId);
        return ResponseEntity.ok(body);
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Map<String, Object>> removeFavorite(@PathVariable Long roomId) {
        favoriteService.removeFavorite(roomId);
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("roomId", roomId);
        return ResponseEntity.ok(body);
    }
}
