package com.digitalhouse.hotelbooking.exception;

public class AdminOperationNotAllowedException extends RuntimeException {
    public AdminOperationNotAllowedException(String message) {
        super(message);
    }
}