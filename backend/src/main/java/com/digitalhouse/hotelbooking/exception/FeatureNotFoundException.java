package com.digitalhouse.hotelbooking.exception;

public class FeatureNotFoundException extends RuntimeException {
    public FeatureNotFoundException(Long id) {
        super("Feature not found: " + id);
    }
}