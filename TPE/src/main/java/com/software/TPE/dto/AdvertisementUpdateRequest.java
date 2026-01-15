package com.software.TPE.dto;

import com.software.TPE.model.AdvertisementStatus;
import jakarta.validation.constraints.NotNull;

public record AdvertisementUpdateRequest(
        @NotNull(message = "El estado es obligatorio")
        AdvertisementStatus status,
        String rejectionReason
) {
}
