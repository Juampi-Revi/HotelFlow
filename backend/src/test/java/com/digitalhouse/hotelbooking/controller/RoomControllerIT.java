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

    @Test
    void searchRooms_withDestination_returnsMatchingRooms() throws Exception {
        RoomRequestDTO room1 = sample("301");
        room1.setCity("Buenos Aires");
        room1.setCountry("Argentina");
        roomService.createRoom(room1);

        RoomRequestDTO room2 = sample("302");
        room2.setCity("Madrid");
        room2.setCountry("Spain");
        roomService.createRoom(room2);

        mockMvc.perform(get("/api/rooms/search")
                .param("destination", "Buenos Aires"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].city").value("Buenos Aires"));
    }

    @Test
    void searchRooms_withGuests_returnsRoomsWithSufficientCapacity() throws Exception {
        RoomRequestDTO room1 = sample("401");
        room1.setCapacity(2);
        roomService.createRoom(room1);

        RoomRequestDTO room2 = sample("402");
        room2.setCapacity(4);
        roomService.createRoom(room2);

        mockMvc.perform(get("/api/rooms/search")
                .param("guests", "3"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].capacity").value(4));
    }

    @Test
    void searchRooms_withPriceRange_returnsRoomsInRange() throws Exception {
        RoomRequestDTO room1 = sample("501");
        room1.setPricePerNight(new BigDecimal("50.00"));
        roomService.createRoom(room1);

        RoomRequestDTO room2 = sample("502");
        room2.setPricePerNight(new BigDecimal("150.00"));
        roomService.createRoom(room2);

        mockMvc.perform(get("/api/rooms/search")
                .param("minPrice", "40")
                .param("maxPrice", "100"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].pricePerNight").value(50.00));
    }

    @Test
    void searchRooms_withRoomType_returnsMatchingType() throws Exception {
        RoomRequestDTO room1 = sample("601");
        room1.setRoomType(RoomType.SINGLE);
        roomService.createRoom(room1);

        RoomRequestDTO room2 = sample("602");
        room2.setRoomType(RoomType.DOUBLE);
        roomService.createRoom(room2);

        mockMvc.perform(get("/api/rooms/search")
                .param("roomType", "DOUBLE"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].roomType").value("DOUBLE"));
    }

    @Test
    void searchRooms_withMultipleFilters_returnsMatchingRooms() throws Exception {
        RoomRequestDTO room1 = sample("701");
        room1.setCity("Buenos Aires");
        room1.setCapacity(4);
        room1.setPricePerNight(new BigDecimal("80.00"));
        room1.setRoomType(RoomType.DOUBLE);
        roomService.createRoom(room1);

        RoomRequestDTO room2 = sample("702");
        room2.setCity("Buenos Aires");
        room2.setCapacity(2);
        room2.setPricePerNight(new BigDecimal("120.00"));
        room2.setRoomType(RoomType.SINGLE);
        roomService.createRoom(room2);

        mockMvc.perform(get("/api/rooms/search")
                .param("destination", "Buenos Aires")
                .param("guests", "3")
                .param("maxPrice", "100")
                .param("roomType", "DOUBLE"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].roomNumber").value("701"));
    }

    @Test
    void searchRooms_withPagination_returnsCorrectPage() throws Exception {
        for (int i = 1; i <= 15; i++) {
            roomService.createRoom(sample("80" + i));
        }

        mockMvc.perform(get("/api/rooms/search")
                .param("page", "1")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(5))
                .andExpect(jsonPath("$.content.length()").value(5))
                .andExpect(jsonPath("$.totalElements").value(15));
    }

    @Test
    void getDestinationSuggestions_returnsMatchingSuggestions() throws Exception {
        RoomRequestDTO room1 = sample("901");
        room1.setCity("Buenos Aires");
        room1.setCountry("Argentina");
        room1.setHotelName("Hotel Buenos Aires");
        roomService.createRoom(room1);

        RoomRequestDTO room2 = sample("902");
        room2.setCity("Barcelona");
        room2.setCountry("Spain");
        room2.setHotelName("Hotel Barcelona");
        roomService.createRoom(room2);

        mockMvc.perform(get("/api/rooms/suggestions")
                .param("query", "Buenos"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0]").value("Buenos Aires"));
    }

    @Test
    void getDestinationSuggestions_withShortQuery_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/rooms/suggestions")
                .param("query", "B"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }
}