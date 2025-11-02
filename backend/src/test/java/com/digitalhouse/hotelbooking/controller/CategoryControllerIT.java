package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.CategoryRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.CategoryResponseDTO;
import com.digitalhouse.hotelbooking.service.CategoryService;
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
class CategoryControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryService categoryService;

    @Test
    void postCategory_returnsCreated_withImageUrl() throws Exception {
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Desert");
        dto.setSlug("desert");
        dto.setDescription("Desert stays");
        dto.setImageUrl("https://example.com/desert.jpg");
        dto.setIsActive(true);

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Desert"))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/desert.jpg"));
    }

    @Test
    void putCategory_updatesImageUrl() throws Exception {
        // create first
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Forest");
        dto.setSlug("forest");
        dto.setDescription("Forest stays");
        dto.setImageUrl("https://example.com/forest.jpg");
        CategoryResponseDTO created = categoryService.create(dto);

        CategoryRequestDTO updateDto = new CategoryRequestDTO();
        updateDto.setImageUrl("https://example.com/forest-new.jpg");

        mockMvc.perform(put("/api/categories/" + created.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/forest-new.jpg"));
    }

    @Test
    void getAll_includesImageUrl() throws Exception {
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].imageUrl").exists());
    }

    @Test
    void patchToggleActive_togglesState() throws Exception {
        // create category
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Caves");
        dto.setSlug("caves");
        dto.setDescription("Caves stays");
        dto.setImageUrl("https://example.com/caves.jpg");
        CategoryResponseDTO created = categoryService.create(dto);

        mockMvc.perform(patch("/api/categories/" + created.getId() + "/toggle-active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive").value(false));
    }

    @Test
    void postCategory_duplicateSlug_returnsConflict() throws Exception {
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Hills");
        dto.setSlug("hills");
        dto.setDescription("Hills stays");
        dto.setImageUrl("https://example.com/hills.jpg");
        categoryService.create(dto);

        CategoryRequestDTO dup = new CategoryRequestDTO();
        dup.setName("Hills-2");
        dup.setSlug("hills");
        dup.setDescription("duplicate slug");
        dup.setImageUrl("https://example.com/hills2.jpg");

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dup)))
                .andExpect(status().isConflict());
    }

    @Test
    void getBySlug_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/categories/slug/nonexistent-slug"))
                .andExpect(status().isNotFound());
    }
}