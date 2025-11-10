package com.software.TPE.dto;

import com.software.TPE.model.WriterApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record WriterApplicationUpdateRequest(
        @NotNull(message = "El estado es obligatorio")
        WriterApplicationStatus estado
) {
}
