package com.software.TPE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    private String id = UUID.randomUUID().toString();
    private String name;
    private String email;
    private String password;
    private String role; // ADMIN, WRITER, READER
    private LocalDateTime createdAt;

}

