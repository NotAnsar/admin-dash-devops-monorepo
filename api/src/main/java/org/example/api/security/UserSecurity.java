package org.example.api.security;

import lombok.RequiredArgsConstructor;
import org.example.api.model.Order;
import org.example.api.model.UserRole;
import org.example.api.repository.OrderRepository;
import org.example.api.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {
    private final OrderRepository orderRepository;

    public boolean isOrderOwner(Authentication authentication, UUID orderId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Order> orderOpt = orderRepository.findById(orderId);

        if (orderOpt.isEmpty()) {
            return false;
        }

        return orderOpt.get().getUser().getId().equals(userDetails.getId());
    }

    public boolean isUser(Authentication authentication, UUID userId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId().equals(userId);
    }

    public boolean hasReadAccess(Authentication authentication) {
        // All authenticated users (ADMIN, USER, GUEST) have read access
        return authentication != null && authentication.isAuthenticated();
    }

    public boolean hasWriteAccess(Authentication authentication) {
        // Only ADMIN and USER roles have write access
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN") || a.getAuthority().equals("USER"));
    }

    public boolean isAdmin(Authentication authentication) {
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));
    }
}