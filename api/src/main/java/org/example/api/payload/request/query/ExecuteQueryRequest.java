package org.example.api.payload.request.query;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExecuteQueryRequest {
    @NotBlank(message = "SQL query is required")
    private String query;
}