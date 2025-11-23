package org.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private long totalClients;
    private long totalProducts;
    private BigDecimal totalRevenue;
    private long totalSales;
}