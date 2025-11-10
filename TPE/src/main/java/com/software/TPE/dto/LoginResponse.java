package com.software.TPE.dto;

public record LoginResponse(
        UserDto user,
        String token
) {
}
