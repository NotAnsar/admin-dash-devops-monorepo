package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.model.PasswordResetToken;
import org.example.api.model.User;
import org.example.api.repository.PasswordResetTokenRepository;
import org.example.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Token valid for 1 hour
    private static final int EXPIRATION_HOURS = 1;
    
    @Transactional
    public String createPasswordResetTokenForUser(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return null;
        }
        
        User user = userOpt.get();
        
        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);
        
        // Create new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setExpiryDate(ZonedDateTime.now().plusHours(EXPIRATION_HOURS));
        
        tokenRepository.save(resetToken);
        
        return token;
    }
    
    @Transactional
    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        
        // Check if token is expired or already used
        if (resetToken.isExpired() || resetToken.isUsed()) {
            return false;
        }
        
        return true;
    }
    
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        
        // Check if token is expired or already used
        if (resetToken.isExpired() || resetToken.isUsed()) {
            return false;
        }
        
        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
        
        return true;
    }
}