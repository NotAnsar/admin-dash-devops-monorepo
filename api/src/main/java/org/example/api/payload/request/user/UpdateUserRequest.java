package org.example.api.payload.request.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.example.api.model.UserRole;

@Data
public class UpdateUserRequest {
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;

    @Email(message = "Email should be valid")
    private String email;

    private UserRole role;

    // Optional password field for updates - not marked @NotBlank
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;
}