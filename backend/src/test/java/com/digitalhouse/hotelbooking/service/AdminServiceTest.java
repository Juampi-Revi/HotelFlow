package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.PermissionsUpdateRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.RoleUpdateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.UserAdminResponseDTO;
import com.digitalhouse.hotelbooking.exception.AdminOperationNotAllowedException;
import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.model.enums.Permission;
import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminService adminService;

    private User actorOwner;

    @BeforeEach
    void initActor() {
        actorOwner = new User();
        setPrivateId(actorOwner, 100L);
        actorOwner.setEmail("owner@example.com");
        actorOwner.setRoles(new HashSet<>(Set.of(Role.OWNER)));

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn("owner@example.com");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(actorOwner));
    }

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void updateAdminRole_makeAdmin_addsDefaultRoomsEditIfNonePresent() {
        User target = new User();
        setPrivateId(target, 1L);
        target.setEmail("user@example.com");
        target.setRoles(new HashSet<>(Set.of(Role.USER)));
        target.setPermissions(new HashSet<>());

        when(userRepository.findById(1L)).thenReturn(Optional.of(target));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RoleUpdateRequestDTO request = new RoleUpdateRequestDTO();
        request.setMakeAdmin(true);

        UserAdminResponseDTO updated = adminService.updateAdminRole(1L, request);

        assertTrue(updated.getRoles().contains(Role.ADMIN));
        assertTrue(updated.getPermissions().contains(Permission.ROOMS_EDIT));
    }

    @Test
    void updateAdminRole_revokeAdmin_lastAdmin_throws() {
        User target = new User();
        setPrivateId(target, 2L);
        target.setEmail("admin@example.com");
        target.setRoles(new HashSet<>(Set.of(Role.ADMIN)));
        target.setPermissions(new HashSet<>(Set.of(Permission.ROOMS_EDIT)));

        when(userRepository.findById(2L)).thenReturn(Optional.of(target));
        when(userRepository.countByRole(Role.ADMIN)).thenReturn(1L);

        RoleUpdateRequestDTO request = new RoleUpdateRequestDTO();
        request.setMakeAdmin(false);

        assertThrows(AdminOperationNotAllowedException.class, () -> adminService.updateAdminRole(2L, request));
    }

    @Test
    void updatePermissions_adminMustKeepOneRoomsPermission_throwsWhenNone() {
        User target = new User();
        setPrivateId(target, 3L);
        target.setEmail("admin2@example.com");
        target.setRoles(new HashSet<>(Set.of(Role.ADMIN)));
        target.setPermissions(new HashSet<>(Set.of(Permission.ROOMS_CREATE)));

        when(userRepository.findById(3L)).thenReturn(Optional.of(target));

        PermissionsUpdateRequestDTO req = new PermissionsUpdateRequestDTO();
        req.setRoomsCreate(false); // remove create
        // roomsEdit remains null -> not added

        assertThrows(AdminOperationNotAllowedException.class, () -> adminService.updatePermissions(3L, req));
    }

    @Test
    void updatePermissions_addRoomsEdit_succeedsForAdmin() {
        User target = new User();
        setPrivateId(target, 4L);
        target.setEmail("admin3@example.com");
        target.setRoles(new HashSet<>(Set.of(Role.ADMIN)));
        target.setPermissions(new HashSet<>(Set.of(Permission.ROOMS_CREATE)));

        when(userRepository.findById(4L)).thenReturn(Optional.of(target));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PermissionsUpdateRequestDTO req = new PermissionsUpdateRequestDTO();
        req.setRoomsEdit(true); // add edit

        UserAdminResponseDTO updated = adminService.updatePermissions(4L, req);
        assertTrue(updated.getPermissions().contains(Permission.ROOMS_CREATE));
        assertTrue(updated.getPermissions().contains(Permission.ROOMS_EDIT));
    }

    // util: set private id via reflection
    private static void setPrivateId(User user, Long id) {
        try {
            java.lang.reflect.Field idField = User.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(user, id);
        } catch (Exception ignored) {}
    }
}