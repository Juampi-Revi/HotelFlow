package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.model.Booking;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.repository.BookingRepository;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import com.digitalhouse.hotelbooking.exception.RoomNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Service
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    
    @Autowired
    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }
    
    /**
     * Get all occupied date ranges for a specific room within a date range
     * This method returns a list of date ranges that are occupied for display in the calendar
     */
    @Transactional(readOnly = true)
    public List<DateRange> getOccupiedDateRanges(Long roomId, LocalDate startDate, LocalDate endDate) {
        // Verify room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + roomId));
        
        // Get all confirmed bookings that overlap with the requested date range
        List<Booking> bookings = bookingRepository.findOccupiedDateRanges(roomId, startDate, endDate);
        
        // Convert bookings to date ranges
        List<DateRange> occupiedRanges = new ArrayList<>();
        for (Booking booking : bookings) {
            occupiedRanges.add(new DateRange(booking.getCheckInDate(), booking.getCheckOutDate()));
        }
        
        return occupiedRanges;
    }
    
    /**
     * Check if a room is available for the given date range
     */
    @Transactional(readOnly = true)
    public boolean isRoomAvailable(Long roomId, LocalDate checkInDate, LocalDate checkOutDate) {
        // Verify room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + roomId));
        
        // Check if room is generally available
        if (!room.getIsAvailable()) {
            return false;
        }
        
        // Check for date conflicts
        return bookingRepository.isRoomAvailable(roomId, checkInDate, checkOutDate);
    }
    
    /**
     * Get all bookings for a specific room
     */
    @Transactional(readOnly = true)
    public List<Booking> getRoomBookings(Long roomId) {
        // Verify room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + roomId));
        
        return bookingRepository.findByRoom_Id(roomId);
    }
    
    /**
     * Get upcoming bookings for a room (from today onwards)
     */
    @Transactional(readOnly = true)
    public List<Booking> getUpcomingRoomBookings(Long roomId) {
        // Verify room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + roomId));
        
        LocalDate today = LocalDate.now();
        return bookingRepository.findBookingsInDateRange(roomId, today, today.plusYears(1));
    }
    
    /**
     * Get availability status for multiple consecutive months
     * This is useful for displaying a calendar view
     */
    @Transactional(readOnly = true)
    public RoomAvailability getRoomAvailability(Long roomId, LocalDate startDate, int monthsToShow) {
        // Verify room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException("Room not found with id: " + roomId));
        
        LocalDate endDate = startDate.plusMonths(monthsToShow);
        
        // Get occupied date ranges
        List<DateRange> occupiedRanges = getOccupiedDateRanges(roomId, startDate, endDate);
        
        return new RoomAvailability(roomId, room.getIsAvailable(), occupiedRanges, startDate, endDate);
    }
    
    /**
     * Inner class to represent a date range
     */
    public static class DateRange {
        private final LocalDate startDate;
        private final LocalDate endDate;
        
        public DateRange(LocalDate startDate, LocalDate endDate) {
            this.startDate = startDate;
            this.endDate = endDate;
        }
        
        public LocalDate getStartDate() {
            return startDate;
        }
        
        public LocalDate getEndDate() {
            return endDate;
        }
    }
    
    /**
     * Inner class to represent room availability information
     */
    public static class RoomAvailability {
        private final Long roomId;
        private final boolean isGenerallyAvailable;
        private final List<DateRange> occupiedRanges;
        private final LocalDate queryStartDate;
        private final LocalDate queryEndDate;
        
        public RoomAvailability(Long roomId, boolean isGenerallyAvailable, 
                               List<DateRange> occupiedRanges, LocalDate queryStartDate, LocalDate queryEndDate) {
            this.roomId = roomId;
            this.isGenerallyAvailable = isGenerallyAvailable;
            this.occupiedRanges = occupiedRanges;
            this.queryStartDate = queryStartDate;
            this.queryEndDate = queryEndDate;
        }
        
        public Long getRoomId() {
            return roomId;
        }
        
        public boolean isGenerallyAvailable() {
            return isGenerallyAvailable;
        }
        
        public List<DateRange> getOccupiedRanges() {
            return occupiedRanges;
        }
        
        public LocalDate getQueryStartDate() {
            return queryStartDate;
        }
        
        public LocalDate getQueryEndDate() {
            return queryEndDate;
        }
    }
}