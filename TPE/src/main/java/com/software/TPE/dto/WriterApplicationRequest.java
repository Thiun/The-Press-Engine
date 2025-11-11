package com.software.TPE.dto;

import jakarta.validation.constraints.NotBlank;

public record WriterApplicationRequest(
        @NotBlank(message = "El identificador del usuario es obligatorio")
        String userId,

        @NotBlank(message = "El nombre del usuario es obligatorio")
        String userName,

        @NotBlank(message = "El correo electrónico del usuario es obligatorio")
        String userEmail,

        @NotBlank(message = "El motivo es obligatorio")
        String motivo
) {
}
