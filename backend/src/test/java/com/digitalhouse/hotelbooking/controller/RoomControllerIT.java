package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import com.digitalhouse.hotelbooking.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RoomControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoomService roomService;

    private RoomRequestDTO sample(String number) {
        RoomRequestDTO dto = new RoomRequestDTO(
                number,
                RoomType.SINGLE,
                2,
                new BigDecimal("99.99"),
                "Nice room",
                List.of("https://example.com/img1.jpg"),
                "Hotel Test",
                "Buenos Aires",
                "Argentina"
        );
        dto.setFloor(1);
        dto.setSizeSqm(new BigDecimal("20"));
        return dto;
    }

    @Test
    void getAvailableRooms_returnsOnlyAvailable() throws Exception {
        RoomResponseDTO r1 = roomService.createRoom(sample("101"));
        RoomResponseDTO r2 = roomService.createRoom(sample("102"));
        // toggle second to unavailable
        roomService.toggleRoomAvailability(r2.getId());

        mockMvc.perform(get("/api/rooms/available"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].roomNumber").value("101"))
                .andExpect(jsonPath("$[1]").doesNotExist());
    }

    @Test
    void getPaginatedRooms_returnsPageWithContent() throws Exception {
        roomService.createRoom(sample("201"));
        roomService.createRoom(sample("202"));

        mockMvc.perform(get("/api/rooms/paginated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.content.length()").value(2));
    }
}