package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.UserDTO;
import org.example.api.payload.request.UpdateProfileRequest;
import org.example.api.payload.request.auth.ChangePasswordRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.security.services.UserDetailsImpl;
import org.example.api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;

    /**
     * Get the current user's profile information
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUserProfile() {
        UserDetailsImpl userDetails = getCurrentUserDetails();

        Optional<UserDTO> userOpt = userService.getUserById(userDetails.getId());
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(new DefaultResponse<UserDTO>("User Profile",true,userOpt.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<Void>("User profile not found",false,null));
        }
    }

    @PatchMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateProfileRequest updateRequest) {
        UUID userId = getCurrentUserDetails().getId();

        Optional<UserDTO> userOpt = userService.getUserById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("User not found", false, null));
        }

        UserDTO userDTO = userOpt.get();
        userDTO.setFirstName(updateRequest.getFirstName());
        userDTO.setLastName(updateRequest.getLastName());

        // Email update requires additional validation to ensure uniqueness
        if (!userDTO.getEmail().equals(updateRequest.getEmail()) &&
                userService.emailExists(updateRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Email is already in use", false, null));
        }
        userDTO.setEmail(updateRequest.getEmail());

        UserDTO updatedUser = userService.updateUser(userDTO);
        return ResponseEntity.ok(
                new DefaultResponse<>("Profile updated successfully", true, updatedUser)
        );
    }

    /**
     * Change the current user's password
     */
    @PatchMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest passwordRequest) {
        UUID userId = getCurrentUserDetails().getId();

        boolean success = userService.changePassword(
                userId,
                passwordRequest.getCurrentPassword(),
                passwordRequest.getNewPassword()
        );

        if (success) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Password changed successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new DefaultResponse<>("Current password is incorrect", false, null));
        }
    }

    /**
     * Delete the current user's account
     */
    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteAccount() {
        UUID userId = getCurrentUserDetails().getId();

        boolean deleted = userService.deleteUser(userId);
        if (deleted) {
            return ResponseEntity.ok(new DefaultResponse<Void>("Account deleted successfully",true,null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<Void>("User not found",false,null));
        }
    }

    /**
     * Helper method to get the current authenticated user
     */
    private UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}