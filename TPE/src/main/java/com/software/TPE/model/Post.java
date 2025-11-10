package com.software.TPE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Document(collection = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Post {
    @Id
    private String id = UUID.randomUUID().toString();

    private String title;
    private String content;
    private String authorId;
    private String authorName;
    private String category;
    private String status; // PENDING, APPROVED, REJECTED
    private String imageUrl;
    private String feedback;
    private String deleteReason; // Razón de eliminación
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}