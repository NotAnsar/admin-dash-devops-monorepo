package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.dto.*;
import org.example.api.model.Order;
import org.example.api.model.OrderItem;
import org.example.api.model.Product;
import org.example.api.repository.OrderRepository;
import org.example.api.repository.ProductRepository;
import org.example.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeService {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    /**
     * Get dashboard summary with total counts and revenue
     */
    public DashboardSummaryDTO getDashboardSummary() {
        // Get total clients (users)
        long totalClients = userRepository.count();

        // Get total products
        long totalProducts = productRepository.count();

        // Calculate total revenue and total sales
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalSales = allOrders.size();

        return new DashboardSummaryDTO(totalClients, totalProducts, totalRevenue, totalSales);
    }

    /**
     * Get monthly revenue for the last 6 months
     */
    public List<MonthlyRevenueDTO> getMonthlyRevenue() {
        // Get all orders from the last 6 months
        ZonedDateTime sixMonthsAgo = ZonedDateTime.now().minusMonths(6);
        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt().isAfter(sixMonthsAgo))
                .collect(Collectors.toList());

        // Group orders by month and calculate total revenue
        Map<String, BigDecimal> monthlyRevenue = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Order order : orders) {
            String month = formatter.format(order.getCreatedAt());
            BigDecimal current = monthlyRevenue.getOrDefault(month, BigDecimal.ZERO);
            monthlyRevenue.put(month, current.add(order.getTotal()));
        }

        // Convert to DTOs
        return monthlyRevenue.entrySet().stream()
                .map(entry -> new MonthlyRevenueDTO(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> a.getMonth().compareTo(b.getMonth()))
                .collect(Collectors.toList());
    }

    /**
     * Get recent orders (latest 10)
     */
    public List<RecentOrderDTO> getRecentOrders() {
        // Get the 10 most recent orders
        List<Order> recentOrders = orderRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());

        // Convert to DTOs
        return recentOrders.stream()
                .map(order -> new RecentOrderDTO(
                        order.getId(),
                        order.getUser().getId(),
                        order.getUser().getFirstName(),
                        order.getUser().getLastName(),
                        order.getUser().getEmail(), // Added email field
                        order.getTotal(),
                        order.getCreatedAt(),
                        order.getStatus().name()
                ))
                .collect(Collectors.toList());
    }

    /**
 * Get products with low stock (inventory alert)
 */
public List<InventoryAlertDTO> getInventoryAlert() {
    int lowStockThreshold = 10; // Configure as needed

    // Find products with stock below threshold
    List<Product> lowStockProducts = productRepository.findAll().stream()
            .filter(product -> product.getStock() <= lowStockThreshold)
            .collect(Collectors.toList());

    // Convert to DTOs
    return lowStockProducts.stream()
            .map(product -> new InventoryAlertDTO(
                    product.getId(),
                    product.getName(),
                    product.getCategory().getName(), // Added category name
                    product.getStock(),
                    true,
                    product.getArchived(), // Added archived status
                    product.getPrice() // Added product price
            ))
            .collect(Collectors.toList());
}

    /**
     * Get sales performance by category
     */
    public List<CategorySalesDTO> getCategorySalesPerformance() {
        // Get all orders with order items
        List<Order> orders = orderRepository.findAll();
        Map<UUID, CategorySalesDTO> categorySalesMap = new HashMap<>();

        // Process each order item
        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                UUID categoryId = item.getProduct().getCategory().getId();
                String categoryName = item.getProduct().getCategory().getName();
                BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                // Update or create category sales data
                if (categorySalesMap.containsKey(categoryId)) {
                    CategorySalesDTO existing = categorySalesMap.get(categoryId);
                    existing.setTotalOrders(existing.getTotalOrders() + 1);
                    existing.setTotalRevenue(existing.getTotalRevenue().add(itemTotal));
                } else {
                    categorySalesMap.put(categoryId, new CategorySalesDTO(
                            categoryId,
                            categoryName,
                            1,
                            itemTotal
                    ));
                }
            }
        }

        // Convert to list and sort by revenue
        return categorySalesMap.values().stream()
                .sorted((a, b) -> b.getTotalRevenue().compareTo(a.getTotalRevenue()))
                .collect(Collectors.toList());
    }
}