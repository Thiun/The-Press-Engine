package com.software.TPE.dto;

import com.software.TPE.model.PostStatus;

import java.time.LocalDateTime;

public record PostResponse(
        String id,
        String title,
        String content,
        String authorId,
        String authorName,
        String category,
        String imageUrl,
        String feedback,
        String deleteReason,
        PostStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
