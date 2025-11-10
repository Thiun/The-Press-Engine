package com.software.TPE.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePostRequest(
        @NotBlank(message = "El título es obligatorio")
        String title,

        @NotBlank(message = "El contenido es obligatorio")
        String content,

        @NotBlank(message = "El identificador del autor es obligatorio")
        String authorId,

        String authorName,
        String category,
        String imageUrl
) {
}
