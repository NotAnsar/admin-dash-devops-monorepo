package org.example.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.api.dto.*;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.HomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {
    private final HomeService homeService;

    /**
     * Get dashboard summary statistics
     * - Total Clients (users)
     * - Total Products
     * - Total Revenue
     * - Total Sales (orders)
     */
    @GetMapping("/summary")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<DashboardSummaryDTO>> getDashboardSummary() {
        DashboardSummaryDTO summary = homeService.getDashboardSummary();
        return ResponseEntity.ok(
                new DefaultResponse<>("Dashboard summary retrieved successfully", true, summary)
        );
    }

    /**
     * Get monthly revenue for the last 6 months
     */
    @GetMapping("/revenue")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<MonthlyRevenueDTO>>> getMonthlyRevenue() {
        List<MonthlyRevenueDTO> revenue = homeService.getMonthlyRevenue();
        return ResponseEntity.ok(
                new DefaultResponse<>("Monthly revenue retrieved successfully", true, revenue)
        );
    }

    /**
     * Get recent orders (latest 10)
     */
    @GetMapping("/recent-orders")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<RecentOrderDTO>>> getRecentOrders() {
        List<RecentOrderDTO> orders = homeService.getRecentOrders();
        return ResponseEntity.ok(
                new DefaultResponse<>("Recent orders retrieved successfully", true, orders)
        );
    }

    /**
     * Get products with low stock (inventory alert)
     */
    @GetMapping("/inventory-alert")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<InventoryAlertDTO>>> getInventoryAlert() {
        List<InventoryAlertDTO> alerts = homeService.getInventoryAlert();
        return ResponseEntity.ok(
                new DefaultResponse<>("Inventory alerts retrieved successfully", true, alerts)
        );
    }

    /**
     * Get sales performance by category
     */
    @GetMapping("/category-performance")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<CategorySalesDTO>>> getCategorySalesPerformance() {
        List<CategorySalesDTO> performance = homeService.getCategorySalesPerformance();
        return ResponseEntity.ok(
                new DefaultResponse<>("Category sales performance retrieved successfully", true, performance)
        );
    }
}