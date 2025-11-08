package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.service.BookingService;
import com.digitalhouse.hotelbooking.service.BookingService.RoomAvailability;
import com.digitalhouse.hotelbooking.service.BookingService.DateRange;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class BookingController {
    
    private final BookingService bookingService;
    
    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    /**
     * Get room availability for a specific date range
     * This endpoint returns occupied date ranges for calendar display
     */
    @GetMapping("/rooms/{roomId}/availability")
    public ResponseEntity<Map<String, Object>> getRoomAvailability(
            @PathVariable Long roomId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(defaultValue = "2") int months) {
        
        // Default to current date if not provided
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        
        // Get room availability information
        RoomAvailability availability = bookingService.getRoomAvailability(roomId, startDate, months);
        
        // Prepare response
        Map<String, Object> response = new HashMap<>();
        response.put("roomId", availability.getRoomId());
        response.put("isGenerallyAvailable", availability.isGenerallyAvailable());
        response.put("queryStartDate", availability.getQueryStartDate());
        response.put("queryEndDate", availability.getQueryEndDate());
        
        // Convert occupied ranges to a simple format for frontend
        List<Map<String, String>> occupiedRanges = availability.getOccupiedRanges().stream()
                .map(range -> {
                    Map<String, String> rangeMap = new HashMap<>();
                    rangeMap.put("startDate", range.getStartDate().toString());
                    rangeMap.put("endDate", range.getEndDate().toString());
                    return rangeMap;
                })
                .toList();
        
        response.put("occupiedRanges", occupiedRanges);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Check if a room is available for specific dates
     * This is useful for booking validation
     */
    @GetMapping("/rooms/{roomId}/availability/check")
    public ResponseEntity<Map<String, Object>> checkRoomAvailability(
            @PathVariable Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {
        
        boolean isAvailable = bookingService.isRoomAvailable(roomId, checkInDate, checkOutDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("checkInDate", checkInDate.toString());
        response.put("checkOutDate", checkOutDate.toString());
        response.put("isAvailable", isAvailable);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get occupied date ranges for a specific room within a date range
     * This is a more focused endpoint for calendar components
     */
    @GetMapping("/rooms/{roomId}/occupied-dates")
    public ResponseEntity<Map<String, Object>> getOccupiedDates(
            @PathVariable Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<DateRange> occupiedRanges = bookingService.getOccupiedDateRanges(roomId, startDate, endDate);
        
        // Convert to simple format
        List<Map<String, String>> ranges = occupiedRanges.stream()
                .map(range -> {
                    Map<String, String> rangeMap = new HashMap<>();
                    rangeMap.put("startDate", range.getStartDate().toString());
                    rangeMap.put("endDate", range.getEndDate().toString());
                    return rangeMap;
                })
                .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("roomId", roomId);
        response.put("queryStartDate", startDate.toString());
        response.put("queryEndDate", endDate.toString());
        response.put("occupiedRanges", ranges);
        
        return ResponseEntity.ok(response);
    }
}