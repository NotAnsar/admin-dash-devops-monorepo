package org.example.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.api.dto.*;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    /**
     * Get revenue and order trends over time
     */
    @GetMapping("/revenue-trends")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<RevenueTrendDTO>>> getRevenueTrends(
            @RequestParam String timeRange) {
        List<RevenueTrendDTO> trends = analyticsService.getRevenueTrends(timeRange);
        return ResponseEntity.ok(
                new DefaultResponse<>("Revenue trends retrieved successfully", true, trends)
        );
    }

    /**
     * Get sales performance by category
     */
    @GetMapping("/category-performance")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<CategoryPerformanceDTO>>> getCategoryPerformance(
            @RequestParam String timeRange) {
        List<CategoryPerformanceDTO> performance = analyticsService.getCategoryPerformance(timeRange);
        return ResponseEntity.ok(
                new DefaultResponse<>("Category performance retrieved successfully", true, performance)
        );
    }

    /**
     * Get order status distribution
     */
    @GetMapping("/order-status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<OrderStatusDTO>>> getOrderStatusDistribution(
            @RequestParam String timeRange) {
        List<OrderStatusDTO> statuses = analyticsService.getOrderStatusDistribution(timeRange);
        return ResponseEntity.ok(
                new DefaultResponse<>("Order status distribution retrieved successfully", true, statuses)
        );
    }

    /**
     * Get top selling products
     */
    @GetMapping("/top-products")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<TopProductDTO>>> getTopSellingProducts(
            @RequestParam String timeRange) {
        List<TopProductDTO> products = analyticsService.getTopSellingProducts(timeRange);
        return ResponseEntity.ok(
                new DefaultResponse<>("Top selling products retrieved successfully", true, products)
        );
    }

    /**
     * Get customer segmentation (new vs returning)
     */
    @GetMapping("/customer-segmentation")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<CustomerSegmentDTO>>> getCustomerSegmentation(
            @RequestParam String timeRange) {
        List<CustomerSegmentDTO> segmentation = analyticsService.getCustomerSegmentation(timeRange);
        return ResponseEntity.ok(
                new DefaultResponse<>("Customer segmentation retrieved successfully", true, segmentation)
        );
    }

    /**
     * Get inventory status
     */
    @GetMapping("/inventory-status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<InventoryStatusDTO>>> getInventoryStatus() {
        // Note: Inventory status doesn't depend on time range
        List<InventoryStatusDTO> inventory = analyticsService.getInventoryStatus();
        return ResponseEntity.ok(
                new DefaultResponse<>("Inventory status retrieved successfully", true, inventory)
        );
    }

    /**
     * Get sales by day of week
     */
    @GetMapping("/sales-by-day")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<SalesByDayDTO>>> getSalesByDayOfWeek(
            @RequestParam String timeRange) {
        List<SalesByDayDTO> salesByDay = analyticsService.getSalesByDayOfWeek(timeRange);
        return ResponseEntity.ok(
                new DefaultResponse<>("Sales by day of week retrieved successfully", true, salesByDay)
        );
    }
}