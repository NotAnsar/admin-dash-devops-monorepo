package org.example.api.repository;

import org.example.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByCategoryId(UUID categoryId);
    List<Product> findByColorId(UUID colorId);
    List<Product> findBySizeId(UUID sizeId);
    List<Product> findByArchivedFalse();
    List<Product> findByFeaturedTrue();

    @Query("SELECT p FROM Product p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:colorId IS NULL OR p.color.id = :colorId) AND " +
            "(:sizeId IS NULL OR p.size.id = :sizeId) AND " +
            "(:archived IS NULL OR p.archived = :archived) AND " +
            "(:featured IS NULL OR p.featured = :featured)")
    List<Product> searchProducts(
            @Param("name") String name,
            @Param("categoryId") UUID categoryId,
            @Param("colorId") UUID colorId,
            @Param("sizeId") UUID sizeId,
            @Param("archived") Boolean archived,
            @Param("featured") Boolean featured
    );
}