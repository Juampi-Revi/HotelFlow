package com.digitalhouse.hotelbooking.service;

import com.digitalhouse.hotelbooking.dto.request.ProductRequestDTO;
import com.digitalhouse.hotelbooking.dto.response.ProductResponseDTO;
import com.digitalhouse.hotelbooking.model.Product;
import com.digitalhouse.hotelbooking.model.enums.ProductCategory;
import com.digitalhouse.hotelbooking.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Product product = mapToEntity(productRequestDTO);
        Product savedProduct = productRepository.save(product);
        
        return mapToResponseDTO(savedProduct);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = findProductById(id);
        return mapToResponseDTO(product);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAvailableProducts() {
        return productRepository.findAllAvailableProducts()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getRandomProducts(int limit) {
        int maxLimit = Math.min(limit, 10);
        return productRepository.findRandomAvailableProducts(maxLimit)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getRandomProductsForHome() {
        return getRandomProducts(10);
    }
    
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO productRequestDTO) {
        Product existingProduct = findProductById(id);
        
        updateProductFields(existingProduct, productRequestDTO);
        Product updatedProduct = productRepository.save(existingProduct);
        
        return mapToResponseDTO(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }
    
    public ProductResponseDTO toggleProductAvailability(Long id) {
        Product product = findProductById(id);
        product.setIsAvailable(!product.getIsAvailable());
        Product updatedProduct = productRepository.save(product);
        
        return mapToResponseDTO(updatedProduct);
    }
    
    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    private Product mapToEntity(ProductRequestDTO dto) {
        Product product = new Product(
                dto.getName(),
                dto.getCategory(),
                dto.getPrice(),
                dto.getDescription(),
                dto.getBrand()
        );
        product.setImages(dto.getImages());
        product.setStock(dto.getStock());
        product.setRating(dto.getRating());
        product.setReviewCount(dto.getReviewCount());
        
        return product;
    }
    
    private void updateProductFields(Product product, ProductRequestDTO dto) {
        product.setName(dto.getName());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        product.setImages(dto.getImages());
        product.setBrand(dto.getBrand());
        product.setStock(dto.getStock());
        product.setRating(dto.getRating());
        product.setReviewCount(dto.getReviewCount());
    }
    
    private ProductResponseDTO mapToResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getCategory(),
                product.getPrice(),
                product.getDescription(),
                product.getImages(),
                product.getBrand(),
                product.getStock(),
                product.getIsAvailable(),
                product.getRating(),
                product.getReviewCount(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}