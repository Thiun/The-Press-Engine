package com.software.TPE.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(
        @NotBlank(message = "El identificador de la noticia es obligatorio")
        String postId,

        @NotBlank(message = "El identificador del usuario es obligatorio")
        String userId,

        @NotBlank(message = "El nombre del usuario es obligatorio")
        String userName,

        @NotBlank(message = "El contenido del comentario es obligatorio")
        String content
) {
}
