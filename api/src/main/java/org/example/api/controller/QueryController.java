package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.payload.request.query.ExecuteQueryRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.QueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/query")
@RequiredArgsConstructor
public class QueryController {
    private final QueryService queryService;

    /**
     * Execute a read-only SQL query
     */
    @PostMapping("/execute")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> executeQuery(@Valid @RequestBody ExecuteQueryRequest request) {
        try {
            List<Map<String, Object>> results = queryService.executeReadOnlyQuery(request.getQuery());
            return ResponseEntity.ok(
                    new DefaultResponse<>("Query executed successfully", true, results)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Error executing query: " + e.getMessage(), false, null));
        }
    }
}