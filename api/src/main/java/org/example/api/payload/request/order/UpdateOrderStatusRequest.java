package org.example.api.payload.request.order;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.api.model.Order.OrderStatus;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Order status is required")
    private OrderStatus status;
}