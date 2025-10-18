package com.digitalhouse.hotelbooking.dto.request;

import jakarta.validation.constraints.NotBlank;

public class FeatureRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;
    private String icon;

    public FeatureRequestDTO() {}

    public FeatureRequestDTO(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}