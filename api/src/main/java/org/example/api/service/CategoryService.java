package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.model.Category;
import org.example.api.dto.CategoryDTO;
import org.example.api.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<CategoryDTO> getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .map(CategoryDTO::fromEntity);
    }

    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setCreatedAt(ZonedDateTime.now());

        Category savedCategory = categoryRepository.save(category);
        return CategoryDTO.fromEntity(savedCategory);
    }

    public CategoryDTO updateCategory(CategoryDTO categoryDTO) {
        Optional<Category> categoryOpt = categoryRepository.findById(categoryDTO.getId());

        if (categoryOpt.isEmpty()) {
            throw new RuntimeException("Category not found");
        }

        Category category = categoryOpt.get();

        if (categoryDTO.getName() != null) {
            category.setName(categoryDTO.getName());
        }

        Category savedCategory = categoryRepository.save(category);
        return CategoryDTO.fromEntity(savedCategory);
    }

    public boolean deleteCategory(UUID id) {
        if (!categoryRepository.existsById(id)) {
            return false;
        }

        categoryRepository.deleteById(id);
        return true;
    }

    public boolean nameExists(String name) {
        return categoryRepository.existsByName(name);
    }
}