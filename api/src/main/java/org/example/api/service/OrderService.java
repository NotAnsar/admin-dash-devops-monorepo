package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.dto.OrderDTO;
import org.example.api.model.Order;
import org.example.api.model.Order.OrderStatus;
import org.example.api.repository.OrderRepository;
import org.example.api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<OrderDTO> getOrderById(UUID id) {
        return orderRepository.findById(id)
                .map(OrderDTO::fromEntity);
    }

    public List<OrderDTO> getOrdersByUser(UUID userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByDateRange(ZonedDateTime start, ZonedDateTime end) {
        return orderRepository.findByCreatedAtBetween(start, end).stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(UUID id, OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Order order = orderOpt.get();
        order.setStatus(status);

        Order savedOrder = orderRepository.save(order);
        return OrderDTO.fromEntity(savedOrder);
    }

    public boolean deleteOrder(UUID id) {
        if (!orderRepository.existsById(id)) {
            return false;
        }

        orderRepository.deleteById(id);
        return true;
    }

    public List<OrderDTO> searchOrders(UUID userId, OrderStatus status, ZonedDateTime startDate, ZonedDateTime endDate) {
        return orderRepository.searchOrders(userId, status, startDate, endDate).stream()
                .map(OrderDTO::fromEntity)
                .collect(Collectors.toList());
    }
}