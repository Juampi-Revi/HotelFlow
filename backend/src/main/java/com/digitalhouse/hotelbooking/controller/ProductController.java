package com.digitalhouse.hotelbooking.controller;

import com.digitalhouse.hotelbooking.dto.request.ProductRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.ProductResponseDTO;
import com.digitalhouse.hotelbooking.model.enums.ProductCategory;
import com.digitalhouse.hotelbooking.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {
    
    private final ProductService productService;
    
    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO productRequestDTO) {
        ProductResponseDTO createdProduct = productService.createProduct(productRequestDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable ProductCategory category) {
        List<ProductResponseDTO> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<ProductResponseDTO>> getAvailableProducts() {
        List<ProductResponseDTO> products = productService.getAvailableProducts();
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/random")
    public ResponseEntity<List<ProductResponseDTO>> getRandomProducts(@RequestParam(defaultValue = "10") int limit) {
        List<ProductResponseDTO> products = productService.getRandomProducts(limit);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/home")
    public ResponseEntity<List<ProductResponseDTO>> getRandomProductsForHome() {
        List<ProductResponseDTO> products = productService.getRandomProductsForHome();
        return ResponseEntity.ok(products);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable Long id, 
                                                           @Valid @RequestBody ProductRequestDTO productRequestDTO) {
        ProductResponseDTO updatedProduct = productService.updateProduct(id, productRequestDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<ProductResponseDTO> toggleProductAvailability(@PathVariable Long id) {
        ProductResponseDTO updatedProduct = productService.toggleProductAvailability(id);
        return ResponseEntity.ok(updatedProduct);
    }
}