package com.digitalhouse.hotelbooking.exception;

public class DuplicateFeatureException extends RuntimeException {
    public DuplicateFeatureException(String name) {
        super("Feature already exists: " + name);
    }
}