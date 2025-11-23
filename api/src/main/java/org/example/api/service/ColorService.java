package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.model.Color;
import org.example.api.dto.ColorDTO;
import org.example.api.repository.ColorRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColorService {
    private final ColorRepository colorRepository;

    public List<ColorDTO> getAllColors() {
        return colorRepository.findAll().stream()
                .map(ColorDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<ColorDTO> getColorById(UUID id) {
        return colorRepository.findById(id)
                .map(ColorDTO::fromEntity);
    }

    public ColorDTO createColor(ColorDTO colorDTO) {
        Color color = new Color();
        color.setName(colorDTO.getName());
        color.setValue(colorDTO.getValue());
        color.setCreatedAt(ZonedDateTime.now());

        Color savedColor = colorRepository.save(color);
        return ColorDTO.fromEntity(savedColor);
    }

    public ColorDTO updateColor(ColorDTO colorDTO) {
        Optional<Color> colorOpt = colorRepository.findById(colorDTO.getId());

        if (colorOpt.isEmpty()) {
            throw new RuntimeException("Color not found");
        }

        Color color = colorOpt.get();

        if (colorDTO.getName() != null) {
            color.setName(colorDTO.getName());
        }

        if (colorDTO.getValue() != null) {
            color.setValue(colorDTO.getValue());
        }

        Color savedColor = colorRepository.save(color);
        return ColorDTO.fromEntity(savedColor);
    }

    public boolean deleteColor(UUID id) {
        if (!colorRepository.existsById(id)) {
            return false;
        }

        colorRepository.deleteById(id);
        return true;
    }

    public boolean nameExists(String name) {
        return colorRepository.existsByName(name);
    }
}