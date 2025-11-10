package com.software.TPE.dto;

import java.time.LocalDateTime;

public record WriterApplicationResponse(
        String id,
        String userId,
        String userName,
        String userEmail,
        String motivacion,
        String estado,
        LocalDateTime fechaSolicitud
) {
}
