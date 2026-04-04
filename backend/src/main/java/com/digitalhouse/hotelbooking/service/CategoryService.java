package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.CategoryRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.CategoryResponseDTO;
import com.digitalhouse.hotelbooking.exception.AdminOperationNotAllowedException;
import com.digitalhouse.hotelbooking.exception.CategoryNotFoundException;
import com.digitalhouse.hotelbooking.exception.DuplicateCategoryException;
import com.digitalhouse.hotelbooking.model.Category;
import com.digitalhouse.hotelbooking.repository.CategoryRepository;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, RoomRepository roomRepository) {
        this.categoryRepository = categoryRepository;
        this.roomRepository = roomRepository;
    }

    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        validateUniqueness(dto.getName(), dto.getSlug());
        Category category = new Category(dto.getName(), dto.getSlug(), dto.getDescription());
        category.setImageUrl(dto.getImageUrl());
        if (dto.getIsActive() != null) category.setIsActive(dto.getIsActive());
        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> getAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponseDTO getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
        return mapToResponse(category);
    }

    @Transactional(readOnly = true)
    public CategoryResponseDTO getBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new CategoryNotFoundException(slug));
        return mapToResponse(category);
    }

    public CategoryResponseDTO update(Long id, CategoryRequestDTO dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        if (dto.getName() != null && !dto.getName().equals(existing.getName())) {
            if (categoryRepository.existsByName(dto.getName())) {
                throw new DuplicateCategoryException("name", dto.getName());
            }
            existing.setName(dto.getName());
        }

        if (dto.getSlug() != null && !dto.getSlug().equals(existing.getSlug())) {
            if (categoryRepository.existsBySlug(dto.getSlug())) {
                throw new DuplicateCategoryException("slug", dto.getSlug());
            }
            existing.setSlug(dto.getSlug());
        }

        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
        }
        if (dto.getImageUrl() != null) {
            existing.setImageUrl(dto.getImageUrl());
        }
        if (dto.getIsActive() != null) {
            existing.setIsActive(dto.getIsActive());
        }

        Category saved = categoryRepository.save(existing);
        return mapToResponse(saved);
    }

    public void delete(Long id) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
        if (roomRepository.existsByCategory_Id(existing.getId())) {
            throw new AdminOperationNotAllowedException("Cannot delete category with associated rooms.");
        }
        categoryRepository.delete(existing);
    }

    public CategoryResponseDTO toggleActive(Long id) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
        existing.setIsActive(!existing.getIsActive());
        Category saved = categoryRepository.save(existing);
        return mapToResponse(saved);
    }

    private void validateUniqueness(String name, String slug) {
        if (categoryRepository.existsByName(name)) {
            throw new DuplicateCategoryException("name", name);
        }
        if (categoryRepository.existsBySlug(slug)) {
            throw new DuplicateCategoryException("slug", slug);
        }
    }

    private CategoryResponseDTO mapToResponse(Category c) {
        return new CategoryResponseDTO(
                c.getId(),
                c.getName(),
                c.getSlug(),
                c.getDescription(),
                c.getImageUrl(),
                c.getIsActive(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
