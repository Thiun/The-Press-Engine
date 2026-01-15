package com.software.TPE.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        String id,
        String postId,
        String userId,
        String userName,
        String content,
        LocalDateTime createdAt
) {
}
