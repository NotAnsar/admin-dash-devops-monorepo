package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.UserDTO;
import org.example.api.model.UserRole;
import org.example.api.payload.request.user.CreateUserRequest;
import org.example.api.payload.request.user.UpdateUserRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.UserService;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * Get all users - admin only
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GUEST')")
    public ResponseEntity<DefaultResponse<List<UserDTO>>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(
                new DefaultResponse<>("Users retrieved successfully", true, users)
        );
    }

    /**
     * Get user by ID - admin only
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<UserDTO>> getUserById(@PathVariable UUID id) {
        Optional<UserDTO> userOpt = userService.getUserById(id);

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("User retrieved successfully", true, userOpt.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("User not found", false, null));
        }
    }

    /**
     * Create new user - admin only
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<UserDTO>> createUser(@Valid @RequestBody CreateUserRequest createRequest) {
        // Check if email exists
        if (userService.emailExists(createRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Email is already in use", false, null));
        }

        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName(createRequest.getFirstName());
        userDTO.setLastName(createRequest.getLastName());
        userDTO.setEmail(createRequest.getEmail());
        userDTO.setPassword(createRequest.getPassword());
        userDTO.setRole(createRequest.getRole() != null ? createRequest.getRole() : UserRole.USER);
        userDTO.setCreatedAt(ZonedDateTime.now());

        UserDTO savedUser = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DefaultResponse<>("User created successfully", true, savedUser));
    }

    /**
     * Update existing user - admin only
     */
    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<UserDTO>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest updateRequest) {

        Optional<UserDTO> userOpt = userService.getUserById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("User not found", false, null));
        }

        UserDTO userDTO = userOpt.get();

        // Only update provided fields (PATCH semantics)
        if (updateRequest.getFirstName() != null) {
            userDTO.setFirstName(updateRequest.getFirstName());
        }

        if (updateRequest.getLastName() != null) {
            userDTO.setLastName(updateRequest.getLastName());
        }

        if (updateRequest.getEmail() != null) {
            // Check email uniqueness only if being changed
            if (!userDTO.getEmail().equals(updateRequest.getEmail()) &&
                    userService.emailExists(updateRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new DefaultResponse<>("Email is already in use", false, null));
            }
            userDTO.setEmail(updateRequest.getEmail());
        }

        if (updateRequest.getRole() != null) {
            userDTO.setRole(updateRequest.getRole());
        }

        if (updateRequest.getPassword() != null) {
            userDTO.setPassword(updateRequest.getPassword());
        }

        UserDTO updatedUser = userService.updateUser(userDTO);
        return ResponseEntity.ok(
                new DefaultResponse<>("User updated successfully", true, updatedUser)
        );
    }

    /**
     * Delete user - admin only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<Void>> deleteUser(@PathVariable UUID id) {
        boolean deleted = userService.deleteUser(id);

        if (deleted) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("User deleted successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("User not found", false, null));
        }
    }
}