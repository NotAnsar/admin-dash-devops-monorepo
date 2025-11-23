package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.UserDTO;
import org.example.api.model.User;
import org.example.api.model.UserRole;
import org.example.api.payload.request.auth.ForgotPasswordRequest;
import org.example.api.payload.request.auth.LoginRequest;
import org.example.api.payload.request.auth.RegisterRequest;
import org.example.api.payload.request.auth.ResetPasswordRequest;
import org.example.api.payload.response.AuthResponse;
import org.example.api.repository.UserRepository;
import org.example.api.security.jwt.JwtUtils;
import org.example.api.security.services.UserDetailsImpl;
import org.example.api.service.EmailService;
import org.example.api.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class  AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // First check if user exists
        if (!userRepository.existsByEmail(loginRequest.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Error: User not found",null,null,false));
        }

        try {
            // User exists, now attempt authentication
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // If we reach here, authentication was successful
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(
                    "User logged in successfully!",
                    new AuthResponse.UserData(
                            userDetails.getId(),
                            userDetails.getFirstName(),
                            userDetails.getLastName(),
                            userDetails.getUsername(),
                            userDetails.getRole(),
                            userDetails.getCreatedAt()
                    ),
                    jwt
            ));
        } catch (BadCredentialsException e) {
            // We know the user exists, so this is definitely an invalid password
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Error: Invalid password",null,null,false));

        } catch (AuthenticationException e) {
            // Other authentication failures
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Error: Authentication failed",null,null,false));

        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        System.out.println(registerRequest.getEmail());
        System.out.println(registerRequest);
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse("Error: Email is already in use!",null,null,false));

        }

        UserDTO userDTO = new UserDTO();
        userDTO.setFirstName(registerRequest.getFirstName());
        userDTO.setLastName(registerRequest.getLastName());
        userDTO.setEmail(registerRequest.getEmail());
        userDTO.setPassword(registerRequest.getPassword());
        userDTO.setCreatedAt(ZonedDateTime.now());
        userDTO.setRole(UserRole.USER);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(new AuthResponse(
                "User registered successfully!",
                new AuthResponse.UserData(
                        userDetails.getId(),
                        userDetails.getFirstName(),
                        userDetails.getLastName(),
                        userDetails.getUsername(),
                        userDetails.getRole(),
                        userDetails.getCreatedAt()
                ),
                jwt
        ));
    }

    @PostMapping("/guest-login")
    public ResponseEntity<?> guestLogin() {
        // Guest credentials - in production, consider using environment variables
        String guestEmail = "guest@example.com";
        String guestPassword = "guest123"; // This is just for demo purposes

        try {
            // Check if guest user exists, if not create it
            if (!userRepository.existsByEmail(guestEmail)) {
                User guestUser = new User();
                guestUser.setFirstName("Guest");
                guestUser.setLastName("User");
                guestUser.setEmail(guestEmail);
                guestUser.setPassword(passwordEncoder.encode(guestPassword));
                guestUser.setRole(UserRole.GUEST);
                guestUser.setCreatedAt(ZonedDateTime.now());
                userRepository.save(guestUser);
            }

            // Authenticate with guest credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(guestEmail, guestPassword));

            // Set authentication and generate JWT
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(
                    "Guest access granted",
                    new AuthResponse.UserData(
                            userDetails.getId(),
                            userDetails.getFirstName(),
                            userDetails.getLastName(),
                            userDetails.getUsername(),
                            userDetails.getRole(),
                            userDetails.getCreatedAt()
                    ),
                    jwt,
                    true
            ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Error: Failed to authenticate guest", null, null, false));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = passwordResetService.createPasswordResetTokenForUser(request.getEmail());

        if (token == null) {
            // We don't want to reveal whether the email exists in the system
            // So we return a success message anyway
            return ResponseEntity.ok(new AuthResponse(
                    "If your email exists in our system, you will receive a password reset link shortly.",
                    null, null, true));
        }

        // Send the email with the reset link
        boolean emailSent = emailService.sendPasswordResetEmail(request.getEmail(), token);

        if (!emailSent) {
            System.out.println("Could not send password reset email to {}");
            System.out.println(request.getEmail());
            // For development purposes, return the token directly
            return ResponseEntity.ok(new AuthResponse(
                    "Email service is not working, use this token to reset: " + token,
                    null, token, true));
        }

        return ResponseEntity.ok(new AuthResponse(
                "Password reset link sent to your email.",
                null, null, true));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        // First validate the token
        if (!passwordResetService.validatePasswordResetToken(request.getToken())) {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse("Invalid or expired password reset token", null, null, false));
        }

        // Then reset the password
        boolean result = passwordResetService.resetPassword(request.getToken(), request.getPassword());

        if (result) {
            return ResponseEntity.ok(new AuthResponse(
                    "Password has been reset successfully. You can now login with your new password.",
                    null, null, true));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new AuthResponse("Failed to reset password", null, null, false));
        }
    }
}