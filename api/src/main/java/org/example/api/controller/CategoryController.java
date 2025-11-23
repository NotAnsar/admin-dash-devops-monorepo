package org.example.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.api.dto.CategoryDTO;
import org.example.api.payload.request.category.CreateCategoryRequest;
import org.example.api.payload.request.category.UpdateCategoryRequest;
import org.example.api.payload.response.DefaultResponse;
import org.example.api.service.CategoryService;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<DefaultResponse<List<CategoryDTO>>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(
                new DefaultResponse<>("Categories retrieved successfully", true, categories)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DefaultResponse<CategoryDTO>> getCategoryById(@PathVariable UUID id) {
        Optional<CategoryDTO> categoryOpt = categoryService.getCategoryById(id);

        if (categoryOpt.isPresent()) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Category retrieved successfully", true, categoryOpt.get())
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Category not found", false, null));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<CategoryDTO>> createCategory(@Valid @RequestBody CreateCategoryRequest createRequest) {
        // Check if name exists
        if (categoryService.nameExists(createRequest.getName())) {
            return ResponseEntity.badRequest()
                    .body(new DefaultResponse<>("Category name already exists", false, null));
        }

        CategoryDTO categoryDTO = new CategoryDTO();
        categoryDTO.setName(createRequest.getName());
        categoryDTO.setCreatedAt(ZonedDateTime.now());

        CategoryDTO savedCategory = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new DefaultResponse<>("Category created successfully", true, savedCategory));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<CategoryDTO>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCategoryRequest updateRequest) {

        Optional<CategoryDTO> categoryOpt = categoryService.getCategoryById(id);
        if (categoryOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Category not found", false, null));
        }

        CategoryDTO categoryDTO = categoryOpt.get();

        // Only update provided fields
        if (updateRequest.getName() != null) {
            // Check name uniqueness only if being changed
            if (!categoryDTO.getName().equals(updateRequest.getName()) &&
                    categoryService.nameExists(updateRequest.getName())) {
                return ResponseEntity.badRequest()
                        .body(new DefaultResponse<>("Category name already exists", false, null));
            }
            categoryDTO.setName(updateRequest.getName());
        }

        CategoryDTO updatedCategory = categoryService.updateCategory(categoryDTO);
        return ResponseEntity.ok(
                new DefaultResponse<>("Category updated successfully", true, updatedCategory)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<DefaultResponse<Void>> deleteCategory(@PathVariable UUID id) {
        boolean deleted = categoryService.deleteCategory(id);

        if (deleted) {
            return ResponseEntity.ok(
                    new DefaultResponse<>("Category deleted successfully", true, null)
            );
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new DefaultResponse<>("Category not found", false, null));
        }
    }
}