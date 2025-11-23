package org.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.api.model.ProductImage;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private UUID id;
    private String url;
    private ZonedDateTime createdAt;

    public static ProductImageDTO fromEntity(ProductImage image) {
        if (image == null) {
            return null;
        }

        return new ProductImageDTO(
                image.getId(),
                image.getUrl(),
                image.getCreatedAt()
        );
    }
}