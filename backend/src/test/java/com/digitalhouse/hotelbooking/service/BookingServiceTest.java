package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.BookingCreateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.BookingResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.exception.BookingNotAvailableException;
import com.digitalhouse.hotelbooking.model.Booking;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import com.digitalhouse.hotelbooking.repository.BookingRepository;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@SpringBootTest
@Transactional
class BookingServiceTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    private User createUser(String email) {
        User u = new User();
        u.setFirstName("Test");
        u.setLastName("User");
        u.setEmail(email);
        u.setPasswordHash("hash");
        u.setRoles(Set.of(Role.USER));
        return userRepository.save(u);
    }

    private Room createRoom(String number, BigDecimal pricePerNight, int capacity) {
        RoomResponseDTO created = roomService.createRoom(new com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO(
                number,
                RoomType.SINGLE,
                capacity,
                pricePerNight,
                "Nice room",
                List.of("https://example.com/img.jpg"),
                "Hotel Test",
                "Buenos Aires",
                "Argentina"
        ));
        return roomRepository.findById(created.getId()).orElseThrow();
    }

    private void authenticateAs(String email) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, "N/A")
        );
    }

    @Test
    void createBookingForCurrentUser_createsBookingAndCalculatesTotal() {
        User user = createUser("booking-user@example.com");
        Room room = createRoom("BK-101", new BigDecimal("100.00"), 2);
        authenticateAs(user.getEmail());

        LocalDate checkIn = LocalDate.now().plusDays(1);
        LocalDate checkOut = checkIn.plusDays(3);

        BookingCreateRequestDTO dto = new BookingCreateRequestDTO();
        dto.setRoomId(room.getId());
        dto.setCheckInDate(checkIn);
        dto.setCheckOutDate(checkOut);
        dto.setNumberOfGuests(2);
        dto.setSpecialRequests("Late check-in");

        BookingResponseDTO created = bookingService.createBookingForCurrentUser(dto);

        Assertions.assertNotNull(created.getId());
        Assertions.assertEquals(room.getId(), created.getRoomId());
        Assertions.assertEquals(checkIn, created.getCheckInDate());
        Assertions.assertEquals(checkOut, created.getCheckOutDate());
        Assertions.assertEquals(new BigDecimal("300.00"), created.getTotalPrice());
        Assertions.assertEquals("CONFIRMED", created.getStatus());
    }

    @Test
    void createBookingForCurrentUser_whenOverlaps_throwsBookingNotAvailable() {
        User user = createUser("booking-overlap@example.com");
        Room room = createRoom("BK-102", new BigDecimal("80.00"), 2);
        authenticateAs(user.getEmail());

        LocalDate checkIn = LocalDate.now().plusDays(5);
        LocalDate checkOut = checkIn.plusDays(3);

        Booking existing = new Booking();
        existing.setRoom(room);
        existing.setUser(user);
        existing.setCheckInDate(checkIn.plusDays(1));
        existing.setCheckOutDate(checkOut.plusDays(2));
        existing.setNumberOfGuests(1);
        existing.setTotalPrice(new BigDecimal("80.00"));
        existing.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(existing);

        BookingCreateRequestDTO dto = new BookingCreateRequestDTO();
        dto.setRoomId(room.getId());
        dto.setCheckInDate(checkIn);
        dto.setCheckOutDate(checkOut);
        dto.setNumberOfGuests(1);

        Assertions.assertThrows(BookingNotAvailableException.class, () -> bookingService.createBookingForCurrentUser(dto));
    }

    @Test
    void listBookingsForCurrentUser_returnsOnlyCurrentUserBookingsOrdered() {
        User user = createUser("booking-list@example.com");
        User other = createUser("booking-other@example.com");
        Room room = createRoom("BK-103", new BigDecimal("50.00"), 2);

        LocalDate base = LocalDate.now().plusDays(10);

        Booking b1 = new Booking();
        b1.setRoom(room);
        b1.setUser(user);
        b1.setCheckInDate(base.plusDays(5));
        b1.setCheckOutDate(base.plusDays(7));
        b1.setNumberOfGuests(1);
        b1.setTotalPrice(new BigDecimal("100.00"));
        b1.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(b1);

        Booking b2 = new Booking();
        b2.setRoom(room);
        b2.setUser(user);
        b2.setCheckInDate(base.plusDays(1));
        b2.setCheckOutDate(base.plusDays(2));
        b2.setNumberOfGuests(1);
        b2.setTotalPrice(new BigDecimal("50.00"));
        b2.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(b2);

        Booking otherBooking = new Booking();
        otherBooking.setRoom(room);
        otherBooking.setUser(other);
        otherBooking.setCheckInDate(base.plusDays(20));
        otherBooking.setCheckOutDate(base.plusDays(21));
        otherBooking.setNumberOfGuests(1);
        otherBooking.setTotalPrice(new BigDecimal("50.00"));
        otherBooking.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(otherBooking);

        authenticateAs(user.getEmail());
        List<BookingResponseDTO> list = bookingService.listBookingsForCurrentUser();

        Assertions.assertEquals(2, list.size());
        Assertions.assertTrue(list.get(0).getCheckInDate().isAfter(list.get(1).getCheckInDate()));
    }
}
