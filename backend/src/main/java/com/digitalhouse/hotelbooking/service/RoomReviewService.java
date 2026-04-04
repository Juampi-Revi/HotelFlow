package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.RoomReviewCreateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomReviewResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomReviewSummaryResponseDTO;
import com.digitalhouse.hotelbooking.exception.AdminOperationNotAllowedException;
import com.digitalhouse.hotelbooking.exception.RoomNotFoundException;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.RoomReview;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.repository.BookingRepository;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import com.digitalhouse.hotelbooking.repository.RoomReviewRepository;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoomReviewService {

    private final RoomReviewRepository roomReviewRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public RoomReviewService(RoomReviewRepository roomReviewRepository,
                             RoomRepository roomRepository,
                             UserRepository userRepository,
                             BookingRepository bookingRepository) {
        this.roomReviewRepository = roomReviewRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public RoomReviewSummaryResponseDTO getReviewsForRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException(roomId);
        }

        RoomReviewRepository.RoomRatingSummary summary = roomReviewRepository.getRatingSummary(roomId);
        BigDecimal avg = summary != null && summary.getAverageRating() != null
                ? BigDecimal.valueOf(summary.getAverageRating()).setScale(2, RoundingMode.HALF_UP)
                : null;
        Long total = summary != null && summary.getTotalRatings() != null ? summary.getTotalRatings() : 0L;

        List<RoomReviewResponseDTO> reviews = roomReviewRepository.findByRoom_IdOrderByCreatedAtDesc(roomId)
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new RoomReviewSummaryResponseDTO(roomId, avg, total, reviews);
    }

    @Transactional(readOnly = true)
    public boolean canCurrentUserReviewRoom(Long roomId) {
        User user = getCurrentUser();
        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException(roomId);
        }
        return bookingRepository.hasCompletedStay(roomId, user.getId(), LocalDate.now());
    }

    @Transactional
    public RoomReviewSummaryResponseDTO createOrUpdateReviewForCurrentUser(RoomReviewCreateRequestDTO dto) {
        User user = getCurrentUser();

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException(dto.getRoomId()));

        boolean eligible = bookingRepository.hasCompletedStay(room.getId(), user.getId(), LocalDate.now());
        if (!eligible) {
            throw new AdminOperationNotAllowedException("Only users with a completed booking can review this room.");
        }

        Optional<RoomReview> existingOpt = roomReviewRepository.findByRoom_IdAndUser_Id(room.getId(), user.getId());

        RoomReview review;
        if (existingOpt.isPresent()) {
            review = existingOpt.get();
            review.setRating(dto.getRating());
            review.setComment(dto.getComment());
        } else {
            review = new RoomReview();
            review.setRoom(room);
            review.setUser(user);
            review.setRating(dto.getRating());
            review.setComment(dto.getComment());
        }

        roomReviewRepository.save(review);
        return getReviewsForRoom(room.getId());
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    private RoomReviewResponseDTO mapToResponse(RoomReview r) {
        String name = "";
        try {
            name = (r.getUser().getFirstName() != null ? r.getUser().getFirstName() : "") +
                    " " +
                    (r.getUser().getLastName() != null ? r.getUser().getLastName() : "");
            name = name.trim();
        } catch (Exception ignored) {
            name = "";
        }
        return new RoomReviewResponseDTO(
                r.getId(),
                r.getRating(),
                r.getComment(),
                name,
                r.getCreatedAt()
        );
    }
}
