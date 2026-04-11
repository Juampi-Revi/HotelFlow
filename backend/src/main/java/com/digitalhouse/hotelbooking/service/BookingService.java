package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.BookingCreateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.BookingResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.EmailResponseDTO;
import com.digitalhouse.hotelbooking.exception.BookingNotAvailableException;
import com.digitalhouse.hotelbooking.exception.BookingNotFoundException;
import com.digitalhouse.hotelbooking.model.Booking;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.repository.BookingRepository;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import com.digitalhouse.hotelbooking.exception.RoomNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);
    
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    @Autowired
    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository, UserRepository userRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
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

    @Transactional
    public BookingResponseDTO createBookingForCurrentUser(BookingCreateRequestDTO dto) {
        User user = getCurrentUser();

        if (dto.getRoomId() == null) {
            throw new IllegalArgumentException("Room id is required");
        }
        if (dto.getCheckInDate() == null || dto.getCheckOutDate() == null) {
            throw new IllegalArgumentException("Check-in and check-out dates are required");
        }
        if (!dto.getCheckInDate().isBefore(dto.getCheckOutDate())) {
            throw new IllegalArgumentException("Check-in date must be before check-out date");
        }
        if (dto.getCheckInDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException(dto.getRoomId()));

        if (!Boolean.TRUE.equals(room.getIsAvailable())) {
            throw new BookingNotAvailableException("Room is not available");
        }

        if (dto.getNumberOfGuests() == null || dto.getNumberOfGuests() < 1) {
            throw new IllegalArgumentException("Number of guests must be at least 1");
        }

        if (room.getCapacity() != null && dto.getNumberOfGuests() > room.getCapacity()) {
            throw new IllegalArgumentException("Number of guests exceeds room capacity");
        }

        boolean available = bookingRepository.isRoomAvailable(room.getId(), dto.getCheckInDate(), dto.getCheckOutDate());
        if (!available) {
            throw new BookingNotAvailableException("Selected dates are not available for this room");
        }

        long nights = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        if (nights <= 0) {
            throw new IllegalArgumentException("Booking must be at least 1 night");
        }

        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setNumberOfGuests(dto.getNumberOfGuests());
        booking.setSpecialRequests(dto.getSpecialRequests());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        Booking saved = bookingRepository.save(booking);
        EmailResponseDTO emailResponse = null;
        try {
            emailResponse = emailService.sendBookingConfirmationEmail(saved);
            if (emailResponse != null && !emailResponse.isSent()) {
                logger.warn("Booking confirmation email not sent for bookingId={} userEmail={} reason={}",
                        saved.getId(),
                        saved.getUser() != null ? saved.getUser().getEmail() : null,
                        emailResponse.getMessage());
            }
        } catch (Exception e) {
            logger.warn("Error sending booking confirmation email for bookingId={}: {}",
                    saved.getId(),
                    e.getMessage());
        }

        BookingResponseDTO response = toResponse(saved);
        if (emailResponse != null) {
            response.setNotificationEmailSent(emailResponse.isSent());
            response.setNotificationEmailMessage(emailResponse.getMessage());
        }
        return response;
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> listBookingsForCurrentUser() {
        User user = getCurrentUser();
        return bookingRepository.findByUser_IdOrderByCheckInDateDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingForCurrentUser(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking id is required");
        }

        User user = getCurrentUser();
        Optional<Booking> bookingOpt = bookingRepository.findByIdAndUser_Id(bookingId, user.getId());
        Booking booking = bookingOpt.orElseThrow(() -> new BookingNotFoundException(bookingId));
        return toResponse(booking);
    }

    @Transactional
    public BookingResponseDTO cancelBookingForCurrentUser(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking id is required");
        }

        User user = getCurrentUser();
        Booking booking = bookingRepository.findByIdAndUser_Id(bookingId, user.getId())
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Only confirmed bookings can be cancelled");
        }

        LocalDate today = LocalDate.now();
        if (booking.getCheckInDate() != null && booking.getCheckInDate().isBefore(today)) {
            throw new IllegalArgumentException("Booking cannot be cancelled after check-in date");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> listAllBookingsForAdmin() {
        return bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "checkInDate")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> listRoomBookingsForAdmin(Long roomId) {
        if (roomId == null) {
            throw new IllegalArgumentException("Room id is required");
        }
        return bookingRepository.findByRoom_Id(roomId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void deleteBookingForCurrentUser(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking id is required");
        }

        User user = getCurrentUser();
        Booking booking = bookingRepository.findByIdAndUser_Id(bookingId, user.getId())
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
            throw new IllegalArgumentException("Confirmed bookings cannot be deleted. Cancel it first.");
        }

        bookingRepository.delete(booking);
    }

    @Transactional
    public void deleteBookingForAdmin(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking id is required");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        bookingRepository.delete(booking);
    }

    private BookingResponseDTO toResponse(Booking booking) {
        Room room = booking.getRoom();
        String imageUrl = null;
        if (room != null && room.getImages() != null && !room.getImages().isEmpty()) {
            imageUrl = room.getImages().get(0);
        }

        return new BookingResponseDTO(
                booking.getId(),
                room != null ? room.getId() : null,
                room != null ? room.getRoomNumber() : null,
                room != null ? room.getHotelName() : null,
                room != null ? room.getCity() : null,
                room != null ? room.getCountry() : null,
                imageUrl,
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getNumberOfGuests(),
                booking.getTotalPrice(),
                booking.getStatus() != null ? booking.getStatus().name() : null,
                booking.getSpecialRequests(),
                booking.getCreatedAt()
        );
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
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
