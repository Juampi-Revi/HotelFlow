package com.digitalhouse.hotelbooking.dto.response;

import com.digitalhouse.hotelbooking.model.enums.Role;
import com.digitalhouse.hotelbooking.model.enums.Permission;
import java.time.LocalDateTime;
import java.util.Set;

public class UserAdminResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Set<Role> roles;
    private Set<Permission> permissions;
    private LocalDateTime createdAt;

    public UserAdminResponseDTO() {}

    public UserAdminResponseDTO(Long id, String firstName, String lastName, String email, Set<Role> roles, Set<Permission> permissions, LocalDateTime createdAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
        this.permissions = permissions;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }

    public Set<Permission> getPermissions() { return permissions; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}