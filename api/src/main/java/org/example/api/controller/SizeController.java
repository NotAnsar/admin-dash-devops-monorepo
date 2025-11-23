package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.SizeDTO;
import org.example.api.payload.request.size.CreateSizeRequest;
import org.example.api.payload.request.size.UpdateSizeRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.SizeService;
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
@RequestMapping("/api/sizes")
@RequiredArgsConstructor
public class SizeController {
    private final SizeService sizeService;

    @GetMapping
    public ResponseEntity<DefaultResponse<List<SizeDTO>>> getAllSizes() {
        List<SizeDTO> sizes = sizeService.getAllSizes();
        return ResponseEntity.ok(
                new DefaultResponse<>("Sizes retrieved successfully", true, sizes)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefaultResponse<SizeDTO>> getSizeById(@PathVariable UUID id) {
        Optional<SizeDTO> sizeOpt = sizeService.getSizeById(id);

        if (sizeOpt.isPresent()) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Size retrieved successfully", true, sizeOpt.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Size not found", false, null));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<SizeDTO>> createSize(@Valid @RequestBody CreateSizeRequest createRequest) {
        // Check if name exists
        if (sizeService.nameExists(createRequest.getName())) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Size name already exists", false, null));
        }

        SizeDTO sizeDTO = new SizeDTO();
        sizeDTO.setName(createRequest.getName());
        sizeDTO.setFullname(createRequest.getFullname());
        sizeDTO.setCreatedAt(ZonedDateTime.now());

        SizeDTO savedSize = sizeService.createSize(sizeDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DefaultResponse<>("Size created successfully", true, savedSize));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<SizeDTO>> updateSize(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSizeRequest updateRequest) {

        Optional<SizeDTO> sizeOpt = sizeService.getSizeById(id);
        if (sizeOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Size not found", false, null));
        }

        SizeDTO sizeDTO = sizeOpt.get();

        // Only update provided fields
        if (updateRequest.getName() != null) {
            // Check name uniqueness only if being changed
            if (!sizeDTO.getName().equals(updateRequest.getName()) &&
                    sizeService.nameExists(updateRequest.getName())) {
                return ResponseEntity.badRequest()
                        .body(new DefaultResponse<>("Size name already exists", false, null));
            }
            sizeDTO.setName(updateRequest.getName());
        }

        if (updateRequest.getFullname() != null) {
            sizeDTO.setFullname(updateRequest.getFullname());
        }

        SizeDTO updatedSize = sizeService.updateSize(sizeDTO);
        return ResponseEntity.ok(
                new DefaultResponse<>("Size updated successfully", true, updatedSize)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<Void>> deleteSize(@PathVariable UUID id) {
        boolean deleted = sizeService.deleteSize(id);

        if (deleted) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Size deleted successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Size not found", false, null));
        }
    }
}