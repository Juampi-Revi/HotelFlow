package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.FeatureRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.FeatureResponseDTO;
import com.digitalhouse.hotelbooking.service.FeatureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
@RequestMapping("/api/features")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public ResponseEntity<List<FeatureResponseDTO>> getActive() {
        return ResponseEntity.ok(featureService.getActive());
    }

    @GetMapping("/all")
    public ResponseEntity<List<FeatureResponseDTO>> getAll() {
        return ResponseEntity.ok(featureService.getAll());
    }

    @PostMapping
    public ResponseEntity<FeatureResponseDTO> create(@Valid @RequestBody FeatureRequestDTO dto) {
        FeatureResponseDTO created = featureService.create(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeatureResponseDTO> update(@PathVariable Long id, @Valid @RequestBody FeatureRequestDTO dto) {
        FeatureResponseDTO updated = featureService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        featureService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<FeatureResponseDTO> toggleActive(@PathVariable Long id) {
        FeatureResponseDTO updated = featureService.toggleActive(id);
        return ResponseEntity.ok(updated);
    }
}