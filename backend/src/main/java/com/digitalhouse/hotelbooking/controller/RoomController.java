package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import com.digitalhouse.hotelbooking.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {
    
    private final RoomService roomService;
    
    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }
    
    @PostMapping
    public ResponseEntity<RoomResponseDTO> createRoom(@Valid @RequestBody RoomRequestDTO roomRequestDTO) {
        RoomResponseDTO createdRoom = roomService.createRoom(roomRequestDTO);
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms() {
        List<RoomResponseDTO> rooms = roomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> getRoomById(@PathVariable Long id) {
        RoomResponseDTO room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }
    
    @GetMapping("/type/{roomType}")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByType(@PathVariable RoomType roomType) {
        List<RoomResponseDTO> rooms = roomService.getRoomsByType(roomType);
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<RoomResponseDTO>> getAvailableRooms() {
        List<RoomResponseDTO> rooms = roomService.getAvailableRooms();
        return ResponseEntity.ok(rooms);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RoomResponseDTO> updateRoom(@PathVariable Long id, 
                                                     @Valid @RequestBody RoomRequestDTO roomRequestDTO) {
        RoomResponseDTO updatedRoom = roomService.updateRoom(id, roomRequestDTO);
        return ResponseEntity.ok(updatedRoom);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<RoomResponseDTO> toggleRoomAvailability(@PathVariable Long id) {
        RoomResponseDTO updatedRoom = roomService.toggleRoomAvailability(id);
        return ResponseEntity.ok(updatedRoom);
    }
}