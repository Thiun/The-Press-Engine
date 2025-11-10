package com.software.TPE.dto;

import com.software.TPE.model.PostStatus;
import jakarta.validation.constraints.NotNull;

public record ReviewPostRequest(
        @NotNull(message = "El estado es obligatorio")
        PostStatus status,
        String feedback,
        String deleteReason
) {
}
