package org.example.api.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryAlertDTO {
    private UUID productId;
    private String productName;
    private String categoryName;
    private int currentStock;
    private boolean lowStock;
    private boolean archived;
    private BigDecimal productPrice;
}