package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.PagedRoomResponseDTO;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import com.digitalhouse.hotelbooking.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
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
    public ResponseEntity<List<RoomResponseDTO>> getAllRooms(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categorySlug
    ) {
        List<RoomResponseDTO> rooms;
        if (categoryId != null) {
            rooms = roomService.getRoomsByCategoryId(categoryId);
        } else if (categorySlug != null && !categorySlug.isEmpty()) {
            rooms = roomService.getRoomsByCategorySlug(categorySlug);
        } else {
            rooms = roomService.getAllRooms();
        }
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
    
    @GetMapping("/paginated")
    public ResponseEntity<PagedRoomResponseDTO> getPaginatedRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) java.util.List<Long> categoryIds) {
        PagedRoomResponseDTO pagedRooms = roomService.getPaginatedRooms(page, size, sortBy, sortDirection, categoryIds);
        return ResponseEntity.ok(pagedRooms);
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
    
    @GetMapping("/search")
    public ResponseEntity<PagedRoomResponseDTO> searchRooms(
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) RoomType roomType,
            @RequestParam(required = false) List<Long> categoryIds,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "pricePerNight") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        PagedRoomResponseDTO searchResults = roomService.searchRooms(
            destination, guests, minPrice, maxPrice, roomType, categoryIds,
            checkIn, checkOut, page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(searchResults);
    }
    
    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getDestinationSuggestions(
            @RequestParam String query) {
        List<String> suggestions = roomService.getDestinationSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}
