package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.FeatureRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.FeatureResponseDTO;
import com.digitalhouse.hotelbooking.exception.DuplicateFeatureException;
import com.digitalhouse.hotelbooking.exception.FeatureNotFoundException;
import com.digitalhouse.hotelbooking.model.Feature;
import com.digitalhouse.hotelbooking.repository.FeatureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FeatureService {

    private final FeatureRepository featureRepository;

    public FeatureService(FeatureRepository featureRepository) {
        this.featureRepository = featureRepository;
    }

    @Transactional(readOnly = true)
    public List<FeatureResponseDTO> getActive() {
        return featureRepository.findByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FeatureResponseDTO> getAll() {
        return featureRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public FeatureResponseDTO create(FeatureRequestDTO dto) {
        if (featureRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateFeatureException(dto.getName());
        }
        Feature feature = new Feature();
        feature.setName(dto.getName());
        feature.setIcon(dto.getIcon());
        feature.setIsActive(true);
        Feature saved = featureRepository.save(feature);
        return toResponse(saved);
    }

    public FeatureResponseDTO update(Long id, FeatureRequestDTO dto) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new FeatureNotFoundException(id));
        String newName = dto.getName();
        if (newName != null && !newName.equalsIgnoreCase(feature.getName())) {
            if (featureRepository.existsByNameIgnoreCase(newName)) {
                throw new DuplicateFeatureException(newName);
            }
            feature.setName(newName);
        }
        feature.setIcon(dto.getIcon());
        Feature updated = featureRepository.save(feature);
        return toResponse(updated);
    }

    public void delete(Long id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new FeatureNotFoundException(id));
        feature.setIsActive(false);
        featureRepository.save(feature);
    }

    public FeatureResponseDTO toggleActive(Long id) {
        Feature feature = featureRepository.findById(id)
                .orElseThrow(() -> new FeatureNotFoundException(id));
        feature.setIsActive(!feature.getIsActive());
        Feature updated = featureRepository.save(feature);
        return toResponse(updated);
    }

    private FeatureResponseDTO toResponse(Feature feature) {
        return new FeatureResponseDTO(
                feature.getId(),
                feature.getName(),
                feature.getIcon(),
                feature.getIsActive()
        );
    }
}