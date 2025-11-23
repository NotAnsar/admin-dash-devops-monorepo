package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.dto.ProductDTO;
import org.example.api.model.*;
import org.example.api.repository.CategoryRepository;
import org.example.api.repository.ColorRepository;
import org.example.api.repository.ProductRepository;
import org.example.api.repository.SizeRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final S3Service s3Service;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<ProductDTO> getProductById(UUID id) {
        return productRepository.findById(id)
                .map(ProductDTO::fromEntity);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        product.setDescription(productDTO.getDescription());
        product.setArchived(productDTO.getArchived() != null ? productDTO.getArchived() : false);
        product.setFeatured(productDTO.getFeatured() != null ? productDTO.getFeatured() : false);
        product.setCreatedAt(ZonedDateTime.now());
    
        // Set category (required)
        if (productDTO.getCategory() != null && productDTO.getCategory().getId() != null) {
            categoryRepository.findById(productDTO.getCategory().getId())
                    .ifPresent(product::setCategory);
        }
    
        // Set color (optional)
        if (productDTO.getColor() != null && productDTO.getColor().getId() != null) {
            colorRepository.findById(productDTO.getColor().getId())
                    .ifPresent(product::setColor);
        }
    
        // Set size (optional)
        if (productDTO.getSize() != null && productDTO.getSize().getId() != null) {
            sizeRepository.findById(productDTO.getSize().getId())
                    .ifPresent(product::setSize);
        }
    
        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }

    public ProductDTO updateProduct(ProductDTO productDTO) {
        Optional<Product> productOpt = productRepository.findById(productDTO.getId());

        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();

        if (productDTO.getName() != null) {
            product.setName(productDTO.getName());
        }

        if (productDTO.getPrice() != null) {
            product.setPrice(productDTO.getPrice());
        }

        if (productDTO.getStock() != null) {
            product.setStock(productDTO.getStock());
        }

        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }

        if (productDTO.getArchived() != null) {
            product.setArchived(productDTO.getArchived());
        }

        if (productDTO.getFeatured() != null) {
            product.setFeatured(productDTO.getFeatured());
        }

        // Update category if provided
        if (productDTO.getCategory() != null && productDTO.getCategory().getId() != null) {
            categoryRepository.findById(productDTO.getCategory().getId())
                    .ifPresent(product::setCategory);
        }

        // Update color if provided
        if (productDTO.getColor() != null && productDTO.getColor().getId() != null) {
            if (productDTO.getColor().getId().toString().equals("00000000-0000-0000-0000-000000000000")) {
                product.setColor(null); // Remove color if "null UUID" is sent
            } else {
                colorRepository.findById(productDTO.getColor().getId())
                        .ifPresent(product::setColor);
            }
        }

        // Update size if provided
        if (productDTO.getSize() != null && productDTO.getSize().getId() != null) {
            if (productDTO.getSize().getId().toString().equals("00000000-0000-0000-0000-000000000000")) {
                product.setSize(null); // Remove size if "null UUID" is sent
            } else {
                sizeRepository.findById(productDTO.getSize().getId())
                        .ifPresent(product::setSize);
            }
        }

        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }

    public Map<String, Object> deleteProduct(UUID id) {
        Map<String, Object> result = new HashMap<>();
        
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isEmpty()) {
            result.put("success", false);
            result.put("message", "Product not found");
            return result;
        }

        Product product = productOpt.get();

        // Check if product has associated order items
        if (product.getOrderItems() != null && !product.getOrderItems().isEmpty()) {
            result.put("success", false);
            result.put("message", "The product is associated with existing orders and cannot be deleted");
            return result;
        }

        // Delete all associated images from S3 before deleting the product
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            for (ProductImage image : product.getImages()) {
                try {
                    // Delete from S3 using the stored key
                    s3Service.deleteFile(image.getKey());
                } catch (Exception e) {
                    // Log error but continue with deletion
                    System.err.println("Failed to delete image file from S3: " + e.getMessage());
                }
            }
        }

        // If no associations, delete the product
        productRepository.deleteById(id);
        result.put("success", true);
        result.put("message", "Product deleted successfully");
        return result;
    }

    public ProductDTO archiveProduct(UUID id) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();
        product.setArchived(true);

        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }

    public List<ProductDTO> findByCategoryId(UUID categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> findByColorId(UUID colorId) {
        return productRepository.findByColorId(colorId).stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> findBySizeId(UUID sizeId) {
        return productRepository.findBySizeId(sizeId).stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getActiveProducts() {
        return productRepository.findByArchivedFalse().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String name, UUID categoryId, UUID colorId, UUID sizeId,
                                           Boolean archived, Boolean featured) {
        return productRepository.searchProducts(name, categoryId, colorId, sizeId, archived, featured).stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Toggle a product's archive status
     * If currently archived -> restore (unarchive)
     * If currently active -> archive
     */
    public ProductDTO toggleArchiveStatus(UUID id) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Product product = productOpt.get();
        // Toggle the archived status (true becomes false, false becomes true)
        product.setArchived(!product.getArchived());

        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }
}