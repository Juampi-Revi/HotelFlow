package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.response.FeatureResponseDTO;
import com.digitalhouse.hotelbooking.dto.response.RoomResponseDTO;
import com.digitalhouse.hotelbooking.model.Favorite;
import com.digitalhouse.hotelbooking.model.Room;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.repository.FavoriteRepository;
import com.digitalhouse.hotelbooking.repository.RoomRepository;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           UserRepository userRepository,
                           RoomRepository roomRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
    }

    @Transactional(readOnly = true)
    public List<Long> listFavoriteRoomIdsForCurrentUser() {
        User user = getCurrentUser();
        return favoriteRepository.findAllByUser_Id(user.getId())
                .stream()
                .map(f -> f.getRoom().getId())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponseDTO> listFavoriteRoomsForCurrentUser() {
        User user = getCurrentUser();
        return favoriteRepository.findRoomsByUserId(user.getId())
                .stream()
                .map(this::mapToRoomResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFavorite(Long roomId) {
        User user = getCurrentUser();
        if (favoriteRepository.existsByUser_IdAndRoom_Id(user.getId(), roomId)) {
            return; // idempotent
        }
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setRoom(room);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long roomId) {
        User user = getCurrentUser();
        favoriteRepository.deleteByUser_IdAndRoom_Id(user.getId(), roomId);
    }

    private RoomResponseDTO mapToRoomResponseDTO(Room room) {
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
            dto.setFeatures(room.getFeatures().stream()
                    .map(f -> new FeatureResponseDTO(f.getId(), f.getName(), f.getIcon(), f.getIsActive()))
                    .toList());
        }

        return dto;
    }
}
