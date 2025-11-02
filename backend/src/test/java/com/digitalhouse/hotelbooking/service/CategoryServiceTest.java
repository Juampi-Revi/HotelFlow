package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.CategoryRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.CategoryResponseDTO;
import com.digitalhouse.hotelbooking.exception.CategoryNotFoundException;
import com.digitalhouse.hotelbooking.exception.DuplicateCategoryException;
import com.digitalhouse.hotelbooking.repository.CategoryRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void createCategory_persistsImageUrl() {
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Lakes");
        dto.setSlug("lakes");
        dto.setDescription("Lake-side stays");
        dto.setImageUrl("https://example.com/lakes.jpg");
        dto.setIsActive(true);

        CategoryResponseDTO created = categoryService.create(dto);
        Assertions.assertNotNull(created.getId());
        Assertions.assertEquals("https://example.com/lakes.jpg", created.getImageUrl());
    }

    @Test
    void updateCategory_updatesImageUrl() {
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Countryside");
        dto.setSlug("countryside");
        dto.setDescription("Nature and calm");
        dto.setImageUrl("https://example.com/country.jpg");
        dto.setIsActive(true);
        CategoryResponseDTO created = categoryService.create(dto);

        CategoryRequestDTO updateDto = new CategoryRequestDTO();
        updateDto.setImageUrl("https://example.com/country-new.jpg");
        CategoryResponseDTO updated = categoryService.update(created.getId(), updateDto);

        Assertions.assertEquals("https://example.com/country-new.jpg", updated.getImageUrl());
    }

    @Test
    void toggleActive_switchesState() {
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("Islands");
        dto.setSlug("islands");
        dto.setDescription("Tropical islands");
        dto.setImageUrl("https://example.com/islands.jpg");
        dto.setIsActive(true);
        CategoryResponseDTO created = categoryService.create(dto);

        CategoryResponseDTO toggled = categoryService.toggleActive(created.getId());
        Assertions.assertEquals(false, toggled.getIsActive());
        CategoryResponseDTO toggledBack = categoryService.toggleActive(created.getId());
        Assertions.assertEquals(true, toggledBack.getIsActive());
    }

    @Test
    void createCategory_duplicateSlug_throws() {
        CategoryRequestDTO dto = new CategoryRequestDTO();
        dto.setName("City Life");
        dto.setSlug("city-life");
        dto.setDescription("Urban stays");
        dto.setImageUrl("https://example.com/city.jpg");
        dto.setIsActive(true);
        categoryService.create(dto);

        CategoryRequestDTO dup = new CategoryRequestDTO();
        dup.setName("City Life Copy");
        dup.setSlug("city-life"); // duplicate slug
        dup.setDescription("Urban stays copy");
        dup.setImageUrl("https://example.com/city2.jpg");

        Assertions.assertThrows(DuplicateCategoryException.class, () -> categoryService.create(dup));
    }

    @Test
    void getBySlug_notFound_throws() {
        Assertions.assertThrows(CategoryNotFoundException.class, () -> categoryService.getBySlug("non-existent-slug"));
    }
}