package com.digitalhouse.hotelbooking.dto.response;

public class FeatureResponseDTO {
    private Long id;
    private String name;
    private String icon;
    private Boolean isActive;

    public FeatureResponseDTO() {}

    public FeatureResponseDTO(Long id, String name, String icon, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}