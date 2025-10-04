package com.digitalhouse.hotelbooking.exception;

public class DuplicateCategoryException extends RuntimeException {
    public DuplicateCategoryException(String field, String value) {
        super("Category with " + field + " '" + value + "' already exists");
    }
}