package com.software.TPE.dto;

import com.software.TPE.model.AdvertisementStatus;

import java.time.LocalDateTime;

public record AdvertisementResponse(
        String id,
        String brand,
        String userId,
        String userName,
        String description,
        String imageUrl,
        int durationDays,
        boolean paid,
        LocalDateTime startDate,
        LocalDateTime endDate,
        AdvertisementStatus status,
        String rejectionReason,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
