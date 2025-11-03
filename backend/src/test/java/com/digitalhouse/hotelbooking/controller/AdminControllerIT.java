package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.model.User;
import com.digitalhouse.hotelbooking.model.enums.Permission;
import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.repository.UserRepository;
import com.digitalhouse.hotelbooking.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User ownerActor;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();

        ownerActor = new User();
        ownerActor.setFirstName("Owner");
        ownerActor.setLastName("Test");
        ownerActor.setEmail("owner@test.local");
        ownerActor.setPasswordHash(passwordEncoder.encode("Owner123!"));
        ownerActor.setIsActive(true);
        ownerActor.setRoles(new HashSet<>(Set.of(Role.OWNER)));
        ownerActor.setPermissions(new HashSet<>());
        ownerActor = userRepository.save(ownerActor);
    }

    private String bearerFor(User user) {
        String token = jwtService.generateToken(user);
        return "Bearer " + token;
    }

    @Test
    @DisplayName("GET /api/admin/users devuelve listado paginado con OWNER autenticado")
    void listUsers_ok() throws Exception {
        // Crear algunos usuarios
        for (int i = 1; i <= 3; i++) {
            User u = new User();
            u.setFirstName("User");
            u.setLastName("" + i);
            u.setEmail("user" + i + "@test.local");
            u.setPasswordHash(passwordEncoder.encode("User123!"));
            u.setIsActive(true);
            u.setRoles(new HashSet<>(Set.of(Role.USER)));
            userRepository.save(u);
        }

        mockMvc.perform(
                        get("/api/admin/users")
                                .header("Authorization", bearerFor(ownerActor))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("PUT /api/admin/users/{id}/role con makeAdmin=true agrega ADMIN y ROOMS_EDIT por defecto")
    void updateRole_makeAdmin_setsDefaultRoomsPermission() throws Exception {
        User target = new User();
        target.setFirstName("Target");
        target.setLastName("User");
        target.setEmail("target@test.local");
        target.setPasswordHash(passwordEncoder.encode("User123!"));
        target.setIsActive(true);
        target.setRoles(new HashSet<>(Set.of(Role.USER)));
        target.setPermissions(new HashSet<>()); // Sin permisos de rooms
        target = userRepository.save(target);

        String payload = "{\n  \"makeAdmin\": true\n}";

        mockMvc.perform(
                        put("/api/admin/users/" + target.getId() + "/role")
                                .header("Authorization", bearerFor(ownerActor))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles").isArray())
                .andExpect(jsonPath("$.roles").value(org.hamcrest.Matchers.hasItem(Role.ADMIN.name())))
                .andExpect(jsonPath("$.permissions").value(org.hamcrest.Matchers.hasItem(Permission.ROOMS_EDIT.name())));
    }

    @Test
    @DisplayName("PUT /api/admin/users/{id}/permissions no permite dejar ADMIN sin permisos de rooms")
    void updatePermissions_adminRequiresAtLeastOneRoomsPermission() throws Exception {
        User targetAdmin = new User();
        targetAdmin.setFirstName("Admin");
        targetAdmin.setLastName("Target");
        targetAdmin.setEmail("admintarget@test.local");
        targetAdmin.setPasswordHash(passwordEncoder.encode("Admin123!"));
        targetAdmin.setIsActive(true);
        targetAdmin.setRoles(new HashSet<>(Set.of(Role.ADMIN)));
        targetAdmin.setPermissions(new HashSet<>(Set.of(Permission.ROOMS_CREATE)));
        targetAdmin = userRepository.save(targetAdmin);

        String payload = "{\n  \"roomsCreate\": false,\n  \"roomsEdit\": false\n}";

        mockMvc.perform(
                        put("/api/admin/users/" + targetAdmin.getId() + "/permissions")
                                .header("Authorization", bearerFor(ownerActor))
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(payload)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Operation Not Allowed"))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Admin must have at least one rooms permission")));
    }
}