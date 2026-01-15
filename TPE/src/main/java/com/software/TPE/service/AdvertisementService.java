package com.software.TPE.service;

import com.software.TPE.dto.AdvertisementRequest;
import com.software.TPE.dto.AdvertisementResponse;
import com.software.TPE.dto.AdvertisementUpdateRequest;
import com.software.TPE.exception.BadRequestException;
import com.software.TPE.exception.ResourceNotFoundException;
import com.software.TPE.model.Advertisement;
import com.software.TPE.model.AdvertisementStatus;
import com.software.TPE.repository.AdvertisementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;

    public List<AdvertisementResponse> findAll() {
        return advertisementRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AdvertisementResponse create(AdvertisementRequest request) {
        if (request.durationDays() <= 0) {
            throw new BadRequestException("La duración debe ser mayor a 0");
        }

        Advertisement advertisement = Advertisement.builder()
                .id(UUID.randomUUID().toString())
                .brand(request.brand().trim())
                .userId(request.userId())
                .userName(request.userName())
                .description(request.description().trim())
                .durationDays(request.durationDays())
                .paid(false)
                .status(AdvertisementStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return toResponse(advertisementRepository.save(advertisement));
    }

    public AdvertisementResponse updateStatus(String adId, AdvertisementUpdateRequest request) {
        Advertisement advertisement = advertisementRepository.findById(adId)
                .orElseThrow(() -> new ResourceNotFoundException("Publicidad no encontrada"));

        advertisement.setStatus(request.status());

        String rejectionReason = request.rejectionReason();
        if (rejectionReason != null && rejectionReason.isBlank()) {
            rejectionReason = null;
        }

        if (request.status() == AdvertisementStatus.APPROVED) {
            rejectionReason = null;
        }

        advertisement.setRejectionReason(rejectionReason);
        advertisement.setUpdatedAt(LocalDateTime.now());

        return toResponse(advertisementRepository.save(advertisement));
    }

    public void delete(String adId) {
        if (!advertisementRepository.existsById(adId)) {
            throw new ResourceNotFoundException("Publicidad no encontrada");
        }
        advertisementRepository.deleteById(adId);
    }

    private AdvertisementResponse toResponse(Advertisement advertisement) {
        return new AdvertisementResponse(
                advertisement.getId(),
                advertisement.getBrand(),
                advertisement.getUserId(),
                advertisement.getUserName(),
                advertisement.getDescription(),
                advertisement.getDurationDays(),
                advertisement.isPaid(),
                advertisement.getStartDate(),
                advertisement.getEndDate(),
                advertisement.getStatus(),
                advertisement.getRejectionReason(),
                advertisement.getCreatedAt(),
                advertisement.getUpdatedAt()
        );
    }
}
