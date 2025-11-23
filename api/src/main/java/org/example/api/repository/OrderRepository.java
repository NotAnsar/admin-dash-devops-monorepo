package org.example.api.repository;

import org.example.api.model.Order;
import org.example.api.model.Order.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    // Find orders by user
    List<Order> findByUserId(UUID userId);

    // Find orders by status
    List<Order> findByStatus(OrderStatus status);

    // Find orders within a date range
    List<Order> findByCreatedAtBetween(ZonedDateTime start, ZonedDateTime end);

    // Find orders created after a specific date
    List<Order> findByCreatedAtAfter(ZonedDateTime date);

    // Get recent orders - used by HomeService for dashboard
    List<Order> findTop10ByOrderByCreatedAtDesc();

    // Get orders for a specific month and year
    @Query("SELECT o FROM Order o WHERE YEAR(o.createdAt) = :year AND MONTH(o.createdAt) = :month")
    List<Order> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

    // Flexible search with multiple optional filters
    @Query("SELECT o FROM Order o WHERE " +
            "(:userId IS NULL OR o.user.id = :userId) AND " +
            "(:status IS NULL OR o.status = :status) AND " +
            "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR o.createdAt <= :endDate)")
    List<Order> searchOrders(
            @Param("userId") UUID userId,
            @Param("status") OrderStatus status,
            @Param("startDate") ZonedDateTime startDate,
            @Param("endDate") ZonedDateTime endDate
    );
}