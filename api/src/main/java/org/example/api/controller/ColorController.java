package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.ColorDTO;
import org.example.api.payload.request.color.CreateColorRequest;
import org.example.api.payload.request.color.UpdateColorRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.ColorService;
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
@RequestMapping("/api/colors")
@RequiredArgsConstructor
public class ColorController {
    private final ColorService colorService;

    @GetMapping
    public ResponseEntity<DefaultResponse<List<ColorDTO>>> getAllColors() {
        List<ColorDTO> colors = colorService.getAllColors();
        return ResponseEntity.ok(
                new DefaultResponse<>("Colors retrieved successfully", true, colors)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefaultResponse<ColorDTO>> getColorById(@PathVariable UUID id) {
        Optional<ColorDTO> colorOpt = colorService.getColorById(id);

        if (colorOpt.isPresent()) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Color retrieved successfully", true, colorOpt.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Color not found", false, null));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<ColorDTO>> createColor(@Valid @RequestBody CreateColorRequest createRequest) {
        // Check if name exists
        if (colorService.nameExists(createRequest.getName())) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Color name already exists", false, null));
        }

        ColorDTO colorDTO = new ColorDTO();
        colorDTO.setName(createRequest.getName());
        colorDTO.setValue(createRequest.getValue());
        colorDTO.setCreatedAt(ZonedDateTime.now());

        ColorDTO savedColor = colorService.createColor(colorDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DefaultResponse<>("Color created successfully", true, savedColor));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<ColorDTO>> updateColor(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateColorRequest updateRequest) {

        Optional<ColorDTO> colorOpt = colorService.getColorById(id);
        if (colorOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Color not found", false, null));
        }

        ColorDTO colorDTO = colorOpt.get();

        // Only update provided fields
        if (updateRequest.getName() != null) {
            // Check name uniqueness only if being changed
            if (!colorDTO.getName().equals(updateRequest.getName()) &&
                    colorService.nameExists(updateRequest.getName())) {
                return ResponseEntity.badRequest()
                        .body(new DefaultResponse<>("Color name already exists", false, null));
            }
            colorDTO.setName(updateRequest.getName());
        }

        if (updateRequest.getValue() != null) {
            colorDTO.setValue(updateRequest.getValue());
        }

        ColorDTO updatedColor = colorService.updateColor(colorDTO);
        return ResponseEntity.ok(
                new DefaultResponse<>("Color updated successfully", true, updatedColor)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<Void>> deleteColor(@PathVariable UUID id) {
        boolean deleted = colorService.deleteColor(id);

        if (deleted) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Color deleted successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Color not found", false, null));
        }
    }
}