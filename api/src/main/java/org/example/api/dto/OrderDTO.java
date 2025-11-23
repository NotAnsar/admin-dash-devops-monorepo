package org.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.api.model.Order;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userEmail;
    private BigDecimal total;
    private ZonedDateTime createdAt;
    private String status;
    private List<OrderItemDTO> items;

    public static OrderDTO fromEntity(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems() != null ?
                order.getOrderItems().stream()
                        .map(OrderItemDTO::fromEntity)
                        .collect(Collectors.toList()) :
                null;

        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getFirstName() + " " + order.getUser().getLastName(),
                order.getUser().getEmail(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getStatus().name(),
                itemDTOs
        );
    }
}