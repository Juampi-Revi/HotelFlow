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
import com.digitalhouse.hotelbooking.repository.FeatureRepository;
import com.digitalhouse.hotelbooking.model.Feature;
import com.digitalhouse.hotelbooking.dto.response.FeatureResponseDTO;
import com.digitalhouse.hotelbooking.repository.RoomReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {
    
    private final RoomRepository roomRepository;
    private final CategoryRepository categoryRepository;
    private final FeatureRepository featureRepository;
    private final RoomReviewRepository roomReviewRepository;
    
    @Autowired
    public RoomService(RoomRepository roomRepository,
                       CategoryRepository categoryRepository,
                       FeatureRepository featureRepository,
                       RoomReviewRepository roomReviewRepository) {
        this.roomRepository = roomRepository;
        this.categoryRepository = categoryRepository;
        this.featureRepository = featureRepository;
        this.roomReviewRepository = roomReviewRepository;
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
    public PagedRoomResponseDTO getPaginatedRooms(int page, int size, String sortBy, String sortDirection, java.util.List<Long> categoryIds) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Room> roomPage;
        if (categoryIds != null && !categoryIds.isEmpty()) {
            roomPage = roomRepository.findByCategory_IdIn(categoryIds, pageable);
        } else {
            roomPage = roomRepository.findAll(pageable);
        }
        
        java.util.List<RoomResponseDTO> roomDTOs = roomPage.getContent()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(java.util.stream.Collectors.toList());
        
        PagedRoomResponseDTO dto = new PagedRoomResponseDTO(
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
        // Set overall total without filters
        dto.setOverallTotalElements(roomRepository.count());
        return dto;
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

    @Transactional(readOnly = true)
    public PagedRoomResponseDTO searchRooms(String destination, Integer guests, 
                                          BigDecimal minPrice, BigDecimal maxPrice, 
                                          RoomType roomType, List<Long> categoryIds,
                                          LocalDate checkIn, LocalDate checkOut,
                                          int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Room> roomPage = roomRepository.searchRooms(
            destination, guests, minPrice, maxPrice, roomType, categoryIds, checkIn, checkOut, pageable
        );
        
        List<RoomResponseDTO> roomDTOs = roomPage.getContent()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        
        PagedRoomResponseDTO dto = new PagedRoomResponseDTO(
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
        dto.setOverallTotalElements(roomRepository.count());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<String> getDestinationSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        List<String> suggestions = new java.util.ArrayList<>();
        suggestions.addAll(roomRepository.findCitiesByQuery(query));
        suggestions.addAll(roomRepository.findCountriesByQuery(query));
        suggestions.addAll(roomRepository.findHotelsByQuery(query));
        
        return suggestions.stream()
                .distinct()
                .limit(10)
                .collect(Collectors.toList());
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
        if (dto.getFeatureIds() != null && !dto.getFeatureIds().isEmpty()) {
            java.util.Set<Feature> features = new java.util.HashSet<>(
                    featureRepository.findAllById(dto.getFeatureIds()).stream()
                            .filter(f -> Boolean.TRUE.equals(f.getIsActive()))
                            .toList()
            );
            room.setFeatures(features);
        } else {
            room.setFeatures(null);
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
        if (dto.getFeatureIds() != null) {
            if (!dto.getFeatureIds().isEmpty()) {
                java.util.Set<Feature> features = new java.util.HashSet<>(
                        featureRepository.findAllById(dto.getFeatureIds()).stream()
                                .filter(f -> Boolean.TRUE.equals(f.getIsActive()))
                                .toList()
                );
                room.setFeatures(features);
            } else {
                room.setFeatures(null);
            }
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
        // Map additional fields to avoid empty info on frontend
        dto.setHotelChain(room.getHotelChain());
        dto.setHotelRating(room.getHotelRating());
        dto.setAddress(room.getAddress());
        dto.setLatitude(room.getLatitude());
        dto.setLongitude(room.getLongitude());
        dto.setAmenities(room.getAmenities());
        dto.setViewType(room.getViewType());
        dto.setFloor(room.getFloor());
        dto.setSizeSqm(room.getSizeSqm());
        dto.setHasBalcony(room.getHasBalcony());
        dto.setHasWifi(room.getHasWifi());
        dto.setHasAirConditioning(room.getHasAirConditioning());
        
        if (room.getCategory() != null) {
            dto.setCategoryId(room.getCategory().getId());
            dto.setCategorySlug(room.getCategory().getSlug());
            dto.setCategoryName(room.getCategory().getName());
        }
        if (room.getFeatures() != null) {
            dto.setFeatures(
                    room.getFeatures().stream()
                            .map(f -> new FeatureResponseDTO(f.getId(), f.getName(), f.getIcon(), f.getIsActive()))
                            .collect(java.util.stream.Collectors.toList())
            );
        }

        RoomReviewRepository.RoomRatingSummary summary = roomReviewRepository.getRatingSummary(room.getId());
        if (summary != null) {
            if (summary.getAverageRating() != null) {
                dto.setAverageRating(BigDecimal.valueOf(summary.getAverageRating()).setScale(2, RoundingMode.HALF_UP));
            }
            if (summary.getTotalRatings() != null) {
                dto.setTotalRatings(summary.getTotalRatings());
            }
        }
        return dto;
    }
}
