package org.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.api.model.Product;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private UUID id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private CategoryDTO category;
    private ZonedDateTime createdAt;
    private String description;
    private Boolean archived;
    private Boolean featured;
    private ColorDTO color;
    private SizeDTO size;
    private List<ProductImageDTO> images;

    public static ProductDTO fromEntity(Product product) {
        if (product == null) {
            return null;
        }

        CategoryDTO categoryDTO = null;
        if (product.getCategory() != null) {
            categoryDTO = CategoryDTO.fromEntity(product.getCategory());
        }

        ColorDTO colorDTO = null;
        if (product.getColor() != null) {
            colorDTO = ColorDTO.fromEntity(product.getColor());
        }

        SizeDTO sizeDTO = null;
        if (product.getSize() != null) {
            sizeDTO = SizeDTO.fromEntity(product.getSize());
        }

        List<ProductImageDTO> imageList = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            imageList = product.getImages().stream()
                    .map(ProductImageDTO::fromEntity)
                    .collect(Collectors.toList());
        }

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getStock(),
                categoryDTO,
                product.getCreatedAt(),
                product.getDescription(),
                product.getArchived(),
                product.getFeatured(),
                colorDTO,
                sizeDTO,
                imageList
        );
    }

    // Method to convert a list of Product entities to DTOs
    public static List<ProductDTO> fromEntities(List<Product> products) {
        if (products == null) {
            return null;
        }
        return products.stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }
}