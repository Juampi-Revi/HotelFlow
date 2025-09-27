package com.digitalhouse.hotelbooking.exception;

public class RoomNotFoundException extends RuntimeException {
    
    public RoomNotFoundException(String message) {
        super(message);
    }
    
    public RoomNotFoundException(Long id) {
        super("Room not found with id: " + id);
    }
    
    public RoomNotFoundException(String field, String value) {
        super("Room not found with " + field + ": " + value);
    }
}