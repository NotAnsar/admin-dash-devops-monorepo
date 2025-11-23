package org.example.api.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategorySalesDTO {
    private UUID categoryId;
    private String categoryName;
    private long totalOrders;
    private BigDecimal totalRevenue;
}