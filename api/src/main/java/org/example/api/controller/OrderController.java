package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.OrderDTO;
import org.example.api.model.Order.OrderStatus;
import org.example.api.payload.request.order.UpdateOrderStatusRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.OrderService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    /**
     * Get all orders - admin only
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<OrderDTO>>> getAllOrders(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime endDate) {

        List<OrderDTO> orders;

        if (userId != null || status != null || startDate != null || endDate != null) {
            orders = orderService.searchOrders(userId, status, startDate, endDate);
        } else {
            orders = orderService.getAllOrders();
        }

        return ResponseEntity.ok(
                new DefaultResponse<>("Orders retrieved successfully", true, orders)
        );
    }

    /**
     * Get order by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST') or @userSecurity.isOrderOwner(authentication, #id)")
    public ResponseEntity<DefaultResponse<OrderDTO>> getOrderById(@PathVariable UUID id) {
        Optional<OrderDTO> orderOpt = orderService.getOrderById(id);

        if (orderOpt.isPresent()) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Order retrieved successfully", true, orderOpt.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Order not found", false, null));
        }
    }

    /**
     * Get orders for a specific user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or @userSecurity.isUser(authentication, #userId)")
    public ResponseEntity<DefaultResponse<List<OrderDTO>>> getOrdersByUser(@PathVariable UUID userId) {
        List<OrderDTO> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(
                new DefaultResponse<>("User orders retrieved successfully", true, orders)
        );
    }

    /**
     * Get orders by status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<List<OrderDTO>>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(
                new DefaultResponse<>("Orders retrieved successfully", true, orders)
        );
    }

    /**
     * Update order status - admin only
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<OrderDTO>> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest updateRequest) {

        try {
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, updateRequest.getStatus());
            return ResponseEntity.ok(
                    new DefaultResponse<>("Order status updated successfully", true, updatedOrder)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Order not found", false, null));
        }
    }

    /**
     * Delete order - admin only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<Void>> deleteOrder(@PathVariable UUID id) {
        boolean deleted = orderService.deleteOrder(id);

        if (deleted) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Order deleted successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Order not found", false, null));
        }
    }
}