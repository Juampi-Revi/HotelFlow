package com.digitalhouse.hotelbooking.dto.request;

import jakarta.validation.constraints.NotNull;

public class RoleUpdateRequestDTO {
    @NotNull
    private Boolean makeAdmin;

    public Boolean getMakeAdmin() {
        return makeAdmin;
    }

    public void setMakeAdmin(Boolean makeAdmin) {
        this.makeAdmin = makeAdmin;
    }
}