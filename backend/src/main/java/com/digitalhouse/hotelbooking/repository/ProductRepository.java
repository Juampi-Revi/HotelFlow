package com.digitalhouse.hotelbooking.repository;

import com.digitalhouse.hotelbooking.model.Product;
import com.digitalhouse.hotelbooking.model.enums.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByCategory(ProductCategory category);
    
    List<Product> findByIsAvailable(Boolean isAvailable);
    
    List<Product> findByBrand(String brand);
    
    @Query("SELECT p FROM Product p WHERE p.isAvailable = true")
    List<Product> findAllAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isAvailable = true ORDER BY p.rating DESC")
    List<Product> findAvailableProductsOrderByRating();
    
    @Query("SELECT p FROM Product p WHERE p.isAvailable = true ORDER BY p.price ASC")
    List<Product> findAvailableProductsOrderByPrice();
    
    @Query(value = "SELECT * FROM products p WHERE p.is_available = true ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Product> findRandomAvailableProducts(@Param("limit") int limit);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isAvailable = true")
    long countAvailableProducts();
}