package org.example.api.repository;

import org.example.api.model.Size;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SizeRepository extends JpaRepository<Size, UUID> {
    boolean existsByName(String name);
}