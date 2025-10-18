package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.RoleUpdateRequestDTO;
import com.digitalhouse.hotelbooking.dto.request.PermissionsUpdateRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.UserAdminResponseDTO;
import com.digitalhouse.hotelbooking.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseEntity<Page<UserAdminResponseDTO>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Page<UserAdminResponseDTO> result = adminService.listUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<UserAdminResponseDTO> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequestDTO request
    ) {
        UserAdminResponseDTO updated = adminService.updateAdminRole(id, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<UserAdminResponseDTO> updatePermissions(
            @PathVariable Long id,
            @Valid @RequestBody PermissionsUpdateRequestDTO request
    ) {
        UserAdminResponseDTO updated = adminService.updatePermissions(id, request);
        return ResponseEntity.ok(updated);
    }
}