package com.digitalhouse.hotelbooking.exception;

public class DuplicateRoomException extends RuntimeException {
    
    public DuplicateRoomException(String roomNumber) {
        super("Room with number '" + roomNumber + "' already exists");
    }
}