package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.RoomReviewCreateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomReviewSummaryResponseDTO;
import com.digitalhouse.hotelbooking.service.RoomReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class RoomReviewController {

    private final RoomReviewService roomReviewService;

    public RoomReviewController(RoomReviewService roomReviewService) {
        this.roomReviewService = roomReviewService;
    }

    @GetMapping("/rooms/{roomId}/reviews")
    public ResponseEntity<RoomReviewSummaryResponseDTO> getReviews(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomReviewService.getReviewsForRoom(roomId));
    }

    @GetMapping("/reviews/rooms/{roomId}/eligibility")
    public ResponseEntity<Map<String, Object>> canReview(@PathVariable Long roomId) {
        boolean canReview = roomReviewService.canCurrentUserReviewRoom(roomId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("roomId", roomId);
        resp.put("canReview", canReview);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reviews")
    public ResponseEntity<RoomReviewSummaryResponseDTO> createOrUpdate(@Valid @RequestBody RoomReviewCreateRequestDTO dto) {
        RoomReviewSummaryResponseDTO updated = roomReviewService.createOrUpdateReviewForCurrentUser(dto);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}

