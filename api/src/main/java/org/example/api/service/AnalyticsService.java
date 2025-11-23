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
import java.time.DayOfWeek;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /**
     * Parse time range and get the start date for filtering
     */
    private ZonedDateTime getStartDateFromTimeRange(String timeRange) {
        ZonedDateTime now = ZonedDateTime.now();

        return switch (timeRange) {
            case "30days" -> now.minusDays(30);
            case "3months" -> now.minusMonths(3);
            case "6months" -> now.minusMonths(6);
            case "1year" -> now.minusYears(1);
            default -> now.minusMonths(6); // Default to 6 months
        };
    }

    /**
     * Get revenue and order trends over time
     */
    public List<RevenueTrendDTO> getRevenueTrends(String timeRange) {
        ZonedDateTime startDate = getStartDateFromTimeRange(timeRange);
        List<Order> orders = orderRepository.findByCreatedAtAfter(startDate);

        // Group by month/week/day based on time range
        String format = switch (timeRange) {
            case "30days" -> "MM-dd"; // Show day for 30 days view
            case "3months", "6months" -> "yyyy-MM"; // Show month for 3-6 months view
            case "1year" -> "yyyy-MM"; // Show month for yearly view
            default -> "yyyy-MM";
        };

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        Map<String, RevenueTrendDTO> trends = new LinkedHashMap<>();

        // Initialize periods (especially important for shorter timeframes)
        ZonedDateTime now = ZonedDateTime.now();
        if ("30days".equals(timeRange)) {
            // For 30 days, initialize each day
            for (int i = 30; i >= 0; i--) {
                String date = formatter.format(now.minusDays(i));
                trends.put(date, new RevenueTrendDTO(date, BigDecimal.ZERO, 0));
            }
        } else if ("3months".equals(timeRange)) {
            // For 3 months, initialize each month
            for (int i = 3; i >= 0; i--) {
                String date = formatter.format(now.minusMonths(i));
                trends.put(date, new RevenueTrendDTO(date, BigDecimal.ZERO, 0));
            }
        } else {
            // For 6 months and 1 year
            int months = "6months".equals(timeRange) ? 6 : 12;
            for (int i = months; i >= 0; i--) {
                String date = formatter.format(now.minusMonths(i));
                trends.put(date, new RevenueTrendDTO(date, BigDecimal.ZERO, 0));
            }
        }

        // Populate with actual data
        for (Order order : orders) {
            String period = formatter.format(order.getCreatedAt());
            if (!trends.containsKey(period)) {
                trends.put(period, new RevenueTrendDTO(period, BigDecimal.ZERO, 0));
            }

            RevenueTrendDTO trend = trends.get(period);
            trend.setRevenue(trend.getRevenue().add(order.getTotal()));
            trend.setOrders(trend.getOrders() + 1);
        }

        return new ArrayList<>(trends.values());
    }

    /**
     * Get sales performance by category
     */
    public List<CategoryPerformanceDTO> getCategoryPerformance(String timeRange) {
        ZonedDateTime startDate = getStartDateFromTimeRange(timeRange);
        List<Order> orders = orderRepository.findByCreatedAtAfter(startDate);

        Map<UUID, CategoryPerformanceDTO> categoryMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                UUID categoryId = item.getProduct().getCategory().getId();
                String categoryName = item.getProduct().getCategory().getName();
                BigDecimal itemRevenue = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                if (!categoryMap.containsKey(categoryId)) {
                    categoryMap.put(categoryId, new CategoryPerformanceDTO(
                            categoryName, BigDecimal.ZERO
                    ));
                }

                CategoryPerformanceDTO category = categoryMap.get(categoryId);
                category.setSales(category.getSales().add(itemRevenue));
            }
        }

        return categoryMap.values().stream()
                .sorted((a, b) -> b.getSales().compareTo(a.getSales()))
                .collect(Collectors.toList());
    }

    /**
     * Get order status distribution
     */
    public List<OrderStatusDTO> getOrderStatusDistribution(String timeRange) {
        ZonedDateTime startDate = getStartDateFromTimeRange(timeRange);
        List<Order> orders = orderRepository.findByCreatedAtAfter(startDate);

        // Group by status
        Map<String, Long> statusCounts = orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getStatus().name(),
                        Collectors.counting()));

        return statusCounts.entrySet().stream()
                .map(entry -> new OrderStatusDTO(entry.getKey(), entry.getValue().intValue()))
                .collect(Collectors.toList());
    }

    /**
     * Get top selling products
     */
    public List<TopProductDTO> getTopSellingProducts(String timeRange) {
        ZonedDateTime startDate = getStartDateFromTimeRange(timeRange);
        List<Order> orders = orderRepository.findByCreatedAtAfter(startDate);

        // Group by product and sum quantities
        Map<UUID, TopProductDTO> productMap = new HashMap<>();

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                UUID productId = item.getProduct().getId();
                String productName = item.getProduct().getName();
                int quantity = item.getQuantity();

                if (!productMap.containsKey(productId)) {
                    productMap.put(productId, new TopProductDTO(
                            productName, 0
                    ));
                }

                TopProductDTO product = productMap.get(productId);
                product.setSales(product.getSales() + quantity);
            }
        }

        // Return top products sorted by sales
        return productMap.values().stream()
                .sorted((a, b) -> Integer.compare(b.getSales(), a.getSales()))
                .limit(5) // Top 5 products
                .collect(Collectors.toList());
    }

    /**
     * Get customer segmentation (new vs returning)
     */
    public List<CustomerSegmentDTO> getCustomerSegmentation(String timeRange) {
        ZonedDateTime startDate = getStartDateFromTimeRange(timeRange);

        // Format based on time range
        String format = switch (timeRange) {
            case "30days" -> "MM-dd"; // Show day for 30 days view
            default -> "yyyy-MM"; // Show month for other views
        };

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
        Map<String, CustomerSegmentDTO> segmentMap = new LinkedHashMap<>();

        // Initialize periods
        ZonedDateTime now = ZonedDateTime.now();
        if ("30days".equals(timeRange)) {
            for (int i = 30; i >= 0; i--) {
                String date = formatter.format(now.minusDays(i));
                segmentMap.put(date, new CustomerSegmentDTO(date, 0, 0));
            }
        } else if ("3months".equals(timeRange)) {
            for (int i = 3; i >= 0; i--) {
                String date = formatter.format(now.minusMonths(i));
                segmentMap.put(date, new CustomerSegmentDTO(date, 0, 0));
            }
        } else {
            int months = "6months".equals(timeRange) ? 6 : 12;
            for (int i = months; i >= 0; i--) {
                String date = formatter.format(now.minusMonths(i));
                segmentMap.put(date, new CustomerSegmentDTO(date, 0, 0));
            }
        }

        // Get all orders in time range
        List<Order> orders = orderRepository.findByCreatedAtAfter(startDate);

        // For each user, find their first order date to determine if they're new
        Map<UUID, ZonedDateTime> firstOrderDates = new HashMap<>();
        for (Order order : orders) {
            UUID userId = order.getUser().getId();
            ZonedDateTime orderDate = order.getCreatedAt();

            if (!firstOrderDates.containsKey(userId) ||
                    orderDate.isBefore(firstOrderDates.get(userId))) {
                firstOrderDates.put(userId, orderDate);
            }
        }

        // Count new vs returning customers for each period
        for (Order order : orders) {
            String period = formatter.format(order.getCreatedAt());
            if (!segmentMap.containsKey(period)) continue;

            UUID userId = order.getUser().getId();
            ZonedDateTime firstOrderDate = firstOrderDates.get(userId);
            boolean isFirstOrder = order.getCreatedAt().isEqual(firstOrderDate);

            CustomerSegmentDTO segment = segmentMap.get(period);
            if (isFirstOrder) {
                segment.setNewCustomers(segment.getNewCustomers() + 1);
            } else {
                segment.setReturning(segment.getReturning() + 1);
            }
        }

        return new ArrayList<>(segmentMap.values());
    }

    /**
     * Get inventory status
     */
    public List<InventoryStatusDTO> getInventoryStatus() {
        // For inventory, we want current status regardless of time range
        int threshold = 15; // Could be configurable

        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(product -> !product.getArchived())
                .sorted((a, b) -> Integer.compare(a.getStock(), b.getStock()))
                .limit(6) // Only show top 6 lowest stock items
                .map(product -> new InventoryStatusDTO(
                        product.getName(),
                        product.getStock(),
                        threshold
                ))
                .collect(Collectors.toList());
    }

    /**
     * Get sales by day of week
     */
    public List<SalesByDayDTO> getSalesByDayOfWeek(String timeRange) {
        ZonedDateTime startDate = getStartDateFromTimeRange(timeRange);
        List<Order> orders = orderRepository.findByCreatedAtAfter(startDate);

        // Initialize map with days of week
        Map<DayOfWeek, SalesByDayDTO> dayMap = new LinkedHashMap<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            String dayName = day.name().charAt(0) + day.name().substring(1).toLowerCase();
            dayMap.put(day, new SalesByDayDTO(dayName, BigDecimal.ZERO, 0));
        }

        // Aggregate data by day of week
        for (Order order : orders) {
            DayOfWeek dayOfWeek = order.getCreatedAt().getDayOfWeek();
            SalesByDayDTO dayData = dayMap.get(dayOfWeek);

            dayData.setSales(dayData.getSales().add(order.getTotal()));
            dayData.setTransactions(dayData.getTransactions() + 1);
        }

        // Sort by day of week (Monday first)
        return dayMap.entrySet().stream()
                .sorted(Comparator.comparingInt(e -> e.getKey().getValue()))
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }
}