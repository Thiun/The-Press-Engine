package com.software.TPE.dto;

import jakarta.validation.constraints.NotBlank;

public record UserActionRequest(
        @NotBlank(message = "La acción es obligatoria")
        String accion
) {
}
