package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.FeatureRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.FeatureResponseDTO;
import com.digitalhouse.hotelbooking.service.FeatureService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class FeatureControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FeatureService featureService;

    @Test
    void getActive_returnsOnlyActiveFeatures() throws Exception {
        FeatureRequestDTO f1 = new FeatureRequestDTO();
        f1.setName("WiFi");
        f1.setIcon("wifi");
        FeatureResponseDTO created1 = featureService.create(f1);

        FeatureRequestDTO f2 = new FeatureRequestDTO();
        f2.setName("Pool");
        f2.setIcon("pool");
        FeatureResponseDTO created2 = featureService.create(f2);

        // toggle second to inactive
        featureService.toggleActive(created2.getId());

        mockMvc.perform(get("/api/features"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("WiFi"))
                .andExpect(jsonPath("$[0].isActive").value(true))
                .andExpect(jsonPath("$[1]").doesNotExist());
    }

    @Test
    void getAll_returnsAllFeatures() throws Exception {
        mockMvc.perform(get("/api/features/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}