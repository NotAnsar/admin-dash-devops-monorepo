package org.example.api.payload.request.product;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UpdateProductRequest {
    @Size(max = 100, message = "Product name must be less than 100 characters")
    private String name;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @PositiveOrZero(message = "Stock must be zero or positive")
    private Integer stock;

    private UUID categoryId;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    private Boolean archived;
    private Boolean featured;
    private UUID colorId;
    private UUID sizeId;
}