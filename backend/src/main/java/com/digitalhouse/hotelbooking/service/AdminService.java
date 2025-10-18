package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.RoleUpdateRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.PermissionsUpdateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.UserAdminResponseDTO;
import com.digitalhouse.hotelbooking.exception.AdminOperationNotAllowedException;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.model.enums.Permission;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<UserAdminResponseDTO> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(u -> new UserAdminResponseDTO(
                        u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getRoles(), u.getPermissions(), u.getCreatedAt()
                ));
    }

    @Transactional
    public UserAdminResponseDTO updateAdminRole(Long userId, RoleUpdateRequestDTO request) {
        // Obtener usuario actor desde el contexto de seguridad
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actorEmail = auth != null ? String.valueOf(auth.getPrincipal()) : null;
        if (actorEmail == null || actorEmail.isBlank()) {
            throw new AdminOperationNotAllowedException("Missing authenticated user context");
        }

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new AdminOperationNotAllowedException("Authenticated user not found"));

        // Solo OWNER puede modificar roles
        if (actor.getRoles() == null || !actor.getRoles().contains(Role.OWNER)) {
            throw new AdminOperationNotAllowedException("Only OWNER can modify user roles");
        }

        // No permitir cambios sobre sí mismo
        if (actor.getId().equals(userId)) {
            throw new AdminOperationNotAllowedException("You cannot change your own roles");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AdminOperationNotAllowedException("User not found"));

        boolean makeAdmin = Boolean.TRUE.equals(request.getMakeAdmin());

        if (makeAdmin) {
            user.getRoles().add(Role.ADMIN);
            // Regla: si otorgamos ADMIN y no tiene permisos de rooms, activar al menos uno por defecto
            if (user.getPermissions() == null) {
                user.setPermissions(new java.util.HashSet<>());
            }
            java.util.Set<Permission> perms = user.getPermissions();
            boolean hasCreate = perms.contains(Permission.ROOMS_CREATE);
            boolean hasEdit = perms.contains(Permission.ROOMS_EDIT);
            if (!hasCreate && !hasEdit) {
                // Activar edición por defecto si no tiene ninguno
                perms.add(Permission.ROOMS_EDIT);
            }
        } else {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            boolean isCurrentlyAdmin = user.getRoles().contains(Role.ADMIN);
            if (isCurrentlyAdmin && adminCount <= 1) {
                throw new AdminOperationNotAllowedException("Cannot revoke role from the last admin");
            }
            user.getRoles().remove(Role.ADMIN);
        }

        User saved = userRepository.save(user);
        return new UserAdminResponseDTO(
                saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail(), saved.getRoles(), saved.getPermissions(), saved.getCreatedAt()
        );
    }

    @Transactional
    public UserAdminResponseDTO updatePermissions(Long userId, PermissionsUpdateRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String actorEmail = auth != null ? String.valueOf(auth.getPrincipal()) : null;
        if (actorEmail == null || actorEmail.isBlank()) {
            throw new AdminOperationNotAllowedException("Missing authenticated user context");
        }

        User actor = userRepository.findByEmail(actorEmail)
                .orElseThrow(() -> new AdminOperationNotAllowedException("Authenticated user not found"));

        if (actor.getRoles() == null || !actor.getRoles().contains(Role.OWNER)) {
            throw new AdminOperationNotAllowedException("Only OWNER can modify user permissions");
        }

        if (actor.getId().equals(userId)) {
            throw new AdminOperationNotAllowedException("You cannot change your own permissions");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AdminOperationNotAllowedException("User not found"));

        if (user.getPermissions() == null) {
            user.setPermissions(new java.util.HashSet<>());
        }

        java.util.Set<Permission> perms = user.getPermissions();

        if (request.getRoomsCreate() != null) {
            if (Boolean.TRUE.equals(request.getRoomsCreate())) perms.add(Permission.ROOMS_CREATE);
            else perms.remove(Permission.ROOMS_CREATE);
        }
        if (request.getRoomsEdit() != null) {
            if (Boolean.TRUE.equals(request.getRoomsEdit())) perms.add(Permission.ROOMS_EDIT);
            else perms.remove(Permission.ROOMS_EDIT);
        }
        if (request.getCategoriesCreate() != null) {
            if (Boolean.TRUE.equals(request.getCategoriesCreate())) perms.add(Permission.CATEGORIES_CREATE);
            else perms.remove(Permission.CATEGORIES_CREATE);
        }
        if (request.getCategoriesEdit() != null) {
            if (Boolean.TRUE.equals(request.getCategoriesEdit())) perms.add(Permission.CATEGORIES_EDIT);
            else perms.remove(Permission.CATEGORIES_EDIT);
        }

        // Regla: si el usuario es ADMIN, debe mantener al menos uno de ROOMS_CREATE o ROOMS_EDIT
        boolean isAdmin = user.getRoles() != null && user.getRoles().contains(Role.ADMIN);
        if (isAdmin) {
            boolean hasRoomsCreate = perms.contains(Permission.ROOMS_CREATE);
            boolean hasRoomsEdit = perms.contains(Permission.ROOMS_EDIT);
            if (!hasRoomsCreate && !hasRoomsEdit) {
                throw new AdminOperationNotAllowedException("Admin must have at least one rooms permission (create or edit)");
            }
        }

        User saved = userRepository.save(user);
        return new UserAdminResponseDTO(
                saved.getId(), saved.getFirstName(), saved.getLastName(), saved.getEmail(), saved.getRoles(), saved.getPermissions(), saved.getCreatedAt()
        );
    }
}