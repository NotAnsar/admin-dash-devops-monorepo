package org.example.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.api.model.Size;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SizeDTO {
    private UUID id;
    private String name;
    private String fullname;
    private ZonedDateTime createdAt;

    public static SizeDTO fromEntity(Size size) {
        return new SizeDTO(
                size.getId(),
                size.getName(),
                size.getFullname(),
                size.getCreatedAt()
        );
    }
}