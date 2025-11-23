package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.model.Product;
import org.example.api.model.ProductImage;
import org.example.api.repository.ProductImageRepository;
import org.example.api.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final S3Service s3Service;

    @Transactional
    public ProductImage addImageToProduct(UUID productId, MultipartFile file) throws IOException {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with ID: " + productId);
        }

        Product product = productOpt.get();

        // Upload to S3 - using the new method that returns both URL and key
        S3Service.S3UploadResult uploadResult = s3Service.uploadFile(file);

        // Create image entity
        ProductImage image = new ProductImage();
        image.setUrl(uploadResult.getUrl());
        image.setKey(uploadResult.getKey());  // Store the complete key
        image.setProduct(product);
        image.setCreatedAt(ZonedDateTime.now());

        // Add image to product
        product.addImage(image);

        // Save the image
        return productImageRepository.save(image);
    }

    @Transactional
    public List<ProductImage> addImagesToProduct(UUID productId, List<MultipartFile> files) throws IOException {
        List<ProductImage> addedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            addedImages.add(addImageToProduct(productId, file));
        }

        return addedImages;
    }

    @Transactional
    public void deleteImage(UUID imageId) {
        Optional<ProductImage> imageOpt = productImageRepository.findById(imageId);
        if (imageOpt.isPresent()) {
            ProductImage image = imageOpt.get();

            try {
                // Delete from S3 using the stored key
                s3Service.deleteFile(image.getKey());

                // Delete from database
                productImageRepository.delete(image);

                System.out.println("Image with ID " + imageId + " deleted successfully");
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete image: " + e.getMessage(), e);
            }
        } else {
            throw new RuntimeException("Image not found with ID: " + imageId);
        }
    }

    public List<ProductImage> getProductImages(UUID productId) {
        return productImageRepository.findByProductId(productId);
    }
}