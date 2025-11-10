package com.software.TPE.dto;

import com.software.TPE.model.UserRole;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRoleRequest(
        @NotNull(message = "El rol es obligatorio")
        UserRole role
) {
}
