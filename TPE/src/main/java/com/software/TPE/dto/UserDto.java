package com.software.TPE.dto;

import com.software.TPE.model.UserRole;
import com.software.TPE.model.UserStatus;

import java.time.LocalDateTime;

public record UserDto(
        String id,
        String name,
        String email,
        UserRole role,
        UserStatus status,
        LocalDateTime createdAt,
        LocalDateTime lastLoginAt
) {
}
