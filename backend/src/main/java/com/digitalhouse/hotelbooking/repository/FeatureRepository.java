package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeatureRepository extends JpaRepository<Feature, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Feature> findByNameIgnoreCase(String name);
    List<Feature> findByIsActiveTrue();
}