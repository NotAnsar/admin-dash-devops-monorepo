package org.example.api.service;

import lombok.RequiredArgsConstructor;
import org.example.api.model.Size;
import org.example.api.dto.SizeDTO;
import org.example.api.repository.SizeRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SizeService {
    private final SizeRepository sizeRepository;

    public List<SizeDTO> getAllSizes() {
        return sizeRepository.findAll().stream()
                .map(SizeDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<SizeDTO> getSizeById(UUID id) {
        return sizeRepository.findById(id)
                .map(SizeDTO::fromEntity);
    }

    public SizeDTO createSize(SizeDTO sizeDTO) {
        Size size = new Size();
        size.setName(sizeDTO.getName());
        size.setFullname(sizeDTO.getFullname());
        size.setCreatedAt(ZonedDateTime.now());

        Size savedSize = sizeRepository.save(size);
        return SizeDTO.fromEntity(savedSize);
    }

    public SizeDTO updateSize(SizeDTO sizeDTO) {
        Optional<Size> sizeOpt = sizeRepository.findById(sizeDTO.getId());

        if (sizeOpt.isEmpty()) {
            throw new RuntimeException("Size not found");
        }

        Size size = sizeOpt.get();

        if (sizeDTO.getName() != null) {
            size.setName(sizeDTO.getName());
        }

        if (sizeDTO.getFullname() != null) {
            size.setFullname(sizeDTO.getFullname());
        }

        Size savedSize = sizeRepository.save(size);
        return SizeDTO.fromEntity(savedSize);
    }

    public boolean deleteSize(UUID id) {
        if (!sizeRepository.existsById(id)) {
            return false;
        }

        sizeRepository.deleteById(id);
        return true;
    }

    public boolean nameExists(String name) {
        return sizeRepository.existsByName(name);
    }
}