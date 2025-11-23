package org.example.api.payload.request.category;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateCategoryRequest {
    @Size(max = 50, message = "Category name must be less than 50 characters")
    private String name;
}