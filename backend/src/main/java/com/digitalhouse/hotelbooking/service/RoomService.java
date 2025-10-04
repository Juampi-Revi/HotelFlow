package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.RoomRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.PagedRoomResponseDTO;
import com.digitalhouse.hotelbooking.exception.DuplicateRoomException;
import com.digitalhouse.hotelbooking.exception.RoomNotFoundException;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.enums.RoomType;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import com.digitalhouse.hotelbooking.repository.CategoryRepository;
import com.digitalhouse.hotelbooking.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {
    
    private final RoomRepository roomRepository;
    private final CategoryRepository categoryRepository;
    
    @Autowired
    public RoomService(RoomRepository roomRepository, CategoryRepository categoryRepository) {
        this.roomRepository = roomRepository;
        this.categoryRepository = categoryRepository;
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
    public List<RoomResponseDTO> getRoomsByCategoryId(Long categoryId) {
        return roomRepository.findByCategory_Id(categoryId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> getRoomsByCategorySlug(String categorySlug) {
        return roomRepository.findByCategory_Slug(categorySlug)
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
    
    @Transactional(readOnly = true)
    public PagedRoomResponseDTO getPaginatedRooms(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Room> roomPage = roomRepository.findAll(pageable);
        
        List<RoomResponseDTO> roomDTOs = roomPage.getContent()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        
        return new PagedRoomResponseDTO(
                roomDTOs,
                roomPage.getNumber(),
                roomPage.getSize(),
                roomPage.getTotalElements(),
                roomPage.getTotalPages(),
                roomPage.isFirst(),
                roomPage.isLast(),
                roomPage.hasNext(),
                roomPage.hasPrevious()
        );
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
        Room room = new Room(dto.getRoomNumber(), dto.getRoomType(), dto.getCapacity(), 
                           dto.getPricePerNight(), dto.getDescription(), dto.getHotelName(), 
                           dto.getCity(), dto.getCountry());
        room.setImages(dto.getImages());
        room.setHotelChain(dto.getHotelChain());
        room.setHotelRating(dto.getHotelRating());
        room.setAddress(dto.getAddress());
        room.setLatitude(dto.getLatitude());
        room.setLongitude(dto.getLongitude());
        room.setAmenities(dto.getAmenities());
        room.setViewType(dto.getViewType());
        room.setFloor(dto.getFloor());
        room.setSizeSqm(dto.getSizeSqm());
        room.setHasBalcony(dto.getHasBalcony());
        room.setHasWifi(dto.getHasWifi());
        room.setHasAirConditioning(dto.getHasAirConditioning());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new com.digitalhouse.hotelbooking.exception.CategoryNotFoundException(dto.getCategoryId()));
            room.setCategory(category);
        }
        return room;
    }
    
    private void updateRoomFields(Room room, RoomRequestDTO dto) {
        room.setRoomNumber(dto.getRoomNumber());
        room.setRoomType(dto.getRoomType());
        room.setCapacity(dto.getCapacity());
        room.setPricePerNight(dto.getPricePerNight());
        room.setDescription(dto.getDescription());
        room.setImages(dto.getImages());
        room.setHotelName(dto.getHotelName());
        room.setHotelChain(dto.getHotelChain());
        room.setHotelRating(dto.getHotelRating());
        room.setCity(dto.getCity());
        room.setCountry(dto.getCountry());
        room.setAddress(dto.getAddress());
        room.setLatitude(dto.getLatitude());
        room.setLongitude(dto.getLongitude());
        room.setAmenities(dto.getAmenities());
        room.setViewType(dto.getViewType());
        room.setFloor(dto.getFloor());
        room.setSizeSqm(dto.getSizeSqm());
        room.setHasBalcony(dto.getHasBalcony());
        room.setHasWifi(dto.getHasWifi());
        room.setHasAirConditioning(dto.getHasAirConditioning());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new com.digitalhouse.hotelbooking.exception.CategoryNotFoundException(dto.getCategoryId()));
            room.setCategory(category);
        } else {
            room.setCategory(null);
        }
    }
    
    private RoomResponseDTO mapToResponseDTO(Room room) {
        RoomResponseDTO dto = new RoomResponseDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getRoomType(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getDescription(),
                room.getImages(),
                room.getHotelName(),
                room.getCity(),
                room.getCountry(),
                room.getIsAvailable(),
                room.getCreatedAt(),
                room.getUpdatedAt()
        );
        if (room.getCategory() != null) {
            dto.setCategoryId(room.getCategory().getId());
            dto.setCategorySlug(room.getCategory().getSlug());
            dto.setCategoryName(room.getCategory().getName());
        }
        return dto;
    }
}