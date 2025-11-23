package org.example.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class GuestAccessDeniedHandler implements AccessDeniedHandler {

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Default response values
        int status = HttpServletResponse.SC_FORBIDDEN;
        Map<String, Object> body = new HashMap<>();
        body.put("status", status);
        body.put("error", "Forbidden");

        // Check if the user is a GUEST
        boolean isGuest = auth != null && auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("GUEST"));

        if (isGuest) {
            // Custom message for GUEST users
            body.put("message", "Guest users are not allowed to modify data.");
        } else {
            // Default message for other users
            body.put("message", "You don't have permission to access this resource.");
        }

        // Set response status and content
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // Write the response
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}