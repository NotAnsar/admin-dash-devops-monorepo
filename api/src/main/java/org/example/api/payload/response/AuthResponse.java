package org.example.api.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.api.model.UserRole;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private UserData user=null;
    private String token;
    private boolean success = true;

    public AuthResponse(String message, UserData user, String token) {
        this.message = message;
        this.user = user;
        this.token = token;
    }

    @Data
    @AllArgsConstructor
    public static class UserData {
        private UUID id;  // Changed from Long to UUID
        private String firstName;
        private String lastName;
        private String email;
        private UserRole role;
        private ZonedDateTime createdAt;
    }
}