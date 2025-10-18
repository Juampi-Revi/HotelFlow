package com.digitalhouse.hotelbooking.dto.request;

public class PermissionsUpdateRequestDTO {
    private Boolean roomsCreate;
    private Boolean roomsEdit;
    private Boolean categoriesCreate;
    private Boolean categoriesEdit;
    private Boolean featuresCreate;
    private Boolean featuresEdit;

    public Boolean getRoomsCreate() { return roomsCreate; }
    public void setRoomsCreate(Boolean roomsCreate) { this.roomsCreate = roomsCreate; }

    public Boolean getRoomsEdit() { return roomsEdit; }
    public void setRoomsEdit(Boolean roomsEdit) { this.roomsEdit = roomsEdit; }

    public Boolean getCategoriesCreate() { return categoriesCreate; }
    public void setCategoriesCreate(Boolean categoriesCreate) { this.categoriesCreate = categoriesCreate; }

    public Boolean getCategoriesEdit() { return categoriesEdit; }
    public void setCategoriesEdit(Boolean categoriesEdit) { this.categoriesEdit = categoriesEdit; }

    public Boolean getFeaturesCreate() { return featuresCreate; }
    public void setFeaturesCreate(Boolean featuresCreate) { this.featuresCreate = featuresCreate; }

    public Boolean getFeaturesEdit() { return featuresEdit; }
    public void setFeaturesEdit(Boolean featuresEdit) { this.featuresEdit = featuresEdit; }
}