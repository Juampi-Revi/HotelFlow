package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.exception.DuplicateRoomException;
import com.digitalhouse.hotelbooking.exception.RoomNotFoundException;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {
    
    private final RoomRepository roomRepository;
    
    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    
    public RoomResponseDTO createRoom(RoomRequestDTO roomRequestDTO) {
        validateRoomNumberUniqueness(roomRequestDTO.getRoomNumber());
        
        Room room = mapToEntity(roomRequestDTO);
        Room savedRoom = roomRepository.save(room);
        
        return mapToResponseDTO(savedRoom);
    }
    
    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getAllRooms() {
        return roomRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public RoomResponseDTO getRoomById(Long id) {
        Room room = findRoomById(id);
        return mapToResponseDTO(room);
    }
    
    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getRoomsByType(RoomType roomType) {
        return roomRepository.findByRoomType(roomType)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getAvailableRooms() {
        return roomRepository.findByIsAvailable(true)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    public RoomResponseDTO updateRoom(Long id, RoomRequestDTO roomRequestDTO) {
        Room existingRoom = findRoomById(id);
        
        if (!existingRoom.getRoomNumber().equals(roomRequestDTO.getRoomNumber())) {
            validateRoomNumberUniqueness(roomRequestDTO.getRoomNumber());
        }
        
        updateRoomFields(existingRoom, roomRequestDTO);
        Room updatedRoom = roomRepository.save(existingRoom);
        
        return mapToResponseDTO(updatedRoom);
    }
    
    public void deleteRoom(Long id) {
        Room room = findRoomById(id);
        roomRepository.delete(room);
    }
    
    public RoomResponseDTO toggleRoomAvailability(Long id) {
        Room room = findRoomById(id);
        room.setIsAvailable(!room.getIsAvailable());
        Room updatedRoom = roomRepository.save(room);
        
        return mapToResponseDTO(updatedRoom);
    }
    
    private Room findRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));
    }
    
    private void validateRoomNumberUniqueness(String roomNumber) {
        if (roomRepository.existsByRoomNumber(roomNumber)) {
            throw new DuplicateRoomException(roomNumber);
        }
    }
    
    private Room mapToEntity(RoomRequestDTO dto) {
        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setPricePerNight(dto.getPricePerNight());
        room.setDescription(dto.getDescription());
        room.setImages(dto.getImages());
        return room;
    }
    
    private void updateRoomFields(Room room, RoomRequestDTO dto) {
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setPricePerNight(dto.getPricePerNight());
        room.setDescription(dto.getDescription());
        room.setImages(dto.getImages());
    }
    
    private RoomResponseDTO mapToResponseDTO(Room room) {
        return new RoomResponseDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getRoomType(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getDescription(),
                room.getImages(),
                room.getIsAvailable(),
                room.getCreatedAt(),
                room.getUpdatedAt()
        );
    }
}