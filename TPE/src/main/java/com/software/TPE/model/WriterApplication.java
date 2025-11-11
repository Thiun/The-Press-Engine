package com.software.TPE.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "writer_applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WriterApplication {
    @Id
    private String id;

    private String userId;

    private String userName;

    private String userEmail;

    private String motivo;

    private WriterApplicationStatus estado;

    @CreatedDate
    private LocalDateTime fechaSolicitud;
}
