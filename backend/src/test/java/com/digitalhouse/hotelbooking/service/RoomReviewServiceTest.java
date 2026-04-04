package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.RoomReviewCreateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomReviewSummaryResponseDTO;
import com.digitalhouse.hotelbooking.exception.AdminOperationNotAllowedException;
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
class RoomReviewServiceTest {

    @Autowired
    private RoomReviewService roomReviewService;

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

    private Room createRoom(String number) {
        RoomResponseDTO created = roomService.createRoom(new com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO(
                number,
                RoomType.SINGLE,
                2,
                new BigDecimal("99.99"),
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

    private void createCompletedBooking(Room room, User user) {
        LocalDate today = LocalDate.now();
        Booking b = new Booking();
        b.setRoom(room);
        b.setUser(user);
        b.setCheckInDate(today.minusDays(3));
        b.setCheckOutDate(today.minusDays(1));
        b.setNumberOfGuests(2);
        b.setTotalPrice(new BigDecimal("199.98"));
        b.setStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(b);
    }

    @Test
    void createOrUpdateReviewForCurrentUser_withoutCompletedStay_throws() {
        User user = createUser("user-no-booking@example.com");
        Room room = createRoom("RR-101");
        authenticateAs(user.getEmail());

        RoomReviewCreateRequestDTO dto = new RoomReviewCreateRequestDTO();
        dto.setRoomId(room.getId());
        dto.setRating(5);
        dto.setComment("Great stay");

        Assertions.assertThrows(AdminOperationNotAllowedException.class, () -> roomReviewService.createOrUpdateReviewForCurrentUser(dto));
    }

    @Test
    void createOrUpdateReviewForCurrentUser_withCompletedStay_createsAndUpdatesSingleReview() {
        User user = createUser("user-with-booking@example.com");
        Room room = createRoom("RR-102");
        createCompletedBooking(room, user);
        authenticateAs(user.getEmail());

        RoomReviewCreateRequestDTO first = new RoomReviewCreateRequestDTO();
        first.setRoomId(room.getId());
        first.setRating(4);
        first.setComment("Good");
        RoomReviewSummaryResponseDTO afterCreate = roomReviewService.createOrUpdateReviewForCurrentUser(first);

        Assertions.assertEquals(room.getId(), afterCreate.getRoomId());
        Assertions.assertEquals(1L, afterCreate.getTotalRatings());
        Assertions.assertEquals(1, afterCreate.getReviews().size());
        Assertions.assertEquals(4, afterCreate.getReviews().get(0).getRating());

        RoomReviewCreateRequestDTO second = new RoomReviewCreateRequestDTO();
        second.setRoomId(room.getId());
        second.setRating(2);
        second.setComment("Not great");
        RoomReviewSummaryResponseDTO afterUpdate = roomReviewService.createOrUpdateReviewForCurrentUser(second);

        Assertions.assertEquals(1L, afterUpdate.getTotalRatings());
        Assertions.assertEquals(1, afterUpdate.getReviews().size());
        Assertions.assertEquals(2, afterUpdate.getReviews().get(0).getRating());
    }
}

