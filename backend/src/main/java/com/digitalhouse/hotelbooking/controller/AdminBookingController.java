package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.response.BookingResponseDTO;
import com.digitalhouse.hotelbooking.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class AdminBookingController {

    private final BookingService bookingService;

    public AdminBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> listAll() {
        return ResponseEntity.ok(bookingService.listAllBookingsForAdmin());
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<BookingResponseDTO>> listByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(bookingService.listRoomBookingsForAdmin(roomId));
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> delete(@PathVariable Long bookingId) {
        bookingService.deleteBookingForAdmin(bookingId);
        return ResponseEntity.noContent().build();
    }
}
