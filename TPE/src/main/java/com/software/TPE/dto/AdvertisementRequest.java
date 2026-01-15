package com.software.TPE.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record AdvertisementRequest(
        @NotBlank(message = "La marca es obligatoria")
        String brand,

        @NotBlank(message = "El identificador del usuario es obligatorio")
        String userId,

        @NotBlank(message = "El nombre del usuario es obligatorio")
        String userName,

        @NotBlank(message = "La descripción es obligatoria")
        String description,

        @Positive(message = "La duración debe ser mayor a 0")
        int durationDays
) {
}
