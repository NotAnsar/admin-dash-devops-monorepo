package org.example.api.repository;

import org.example.api.model.Color;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ColorRepository extends JpaRepository<Color, UUID> {
    boolean existsByName(String name);
}