package org.example.api.payload.request.color;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateColorRequest {
    @Size(max = 50, message = "Color name must be less than 50 characters")
    private String name;

    @Size(max = 50, message = "Color value must be less than 50 characters")
    private String value;
}