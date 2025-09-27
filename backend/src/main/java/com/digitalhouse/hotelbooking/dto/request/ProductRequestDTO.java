package com.digitalhouse.hotelbooking.dto.request;

import com.digitalhouse.hotelbooking.model.enums.ProductCategory;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class ProductRequestDTO {
    
    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name cannot exceed 255 characters")
    private String name;
    
    @NotNull(message = "Product category is required")
    private ProductCategory category;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    private List<String> images;
    
    @NotBlank(message = "Brand is required")
    @Size(max = 100, message = "Brand cannot exceed 100 characters")
    private String brand;
    
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock = 0;
    
    @DecimalMin(value = "0.0", message = "Rating cannot be negative")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5.0")
    private BigDecimal rating;
    
    @Min(value = 0, message = "Review count cannot be negative")
    private Integer reviewCount = 0;
    
    public ProductRequestDTO() {}
    
    public ProductRequestDTO(String name, ProductCategory category, BigDecimal price, String description, 
                            List<String> images, String brand, Integer stock, BigDecimal rating, Integer reviewCount) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.description = description;
        this.images = images;
        this.brand = brand;
        this.stock = stock;
        this.rating = rating;
        this.reviewCount = reviewCount;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public ProductCategory getCategory() {
        return category;
    }
    
    public void setCategory(ProductCategory category) {
        this.category = category;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getImages() {
        return images;
    }
    
    public void setImages(List<String> images) {
        this.images = images;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    public BigDecimal getRating() {
        return rating;
    }
    
    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
    
    public Integer getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
}