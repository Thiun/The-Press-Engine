package com.software.TPE.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "advertisements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Advertisement {
    @Id
    private String id;

    private String brand;

    private String userId;

    private String userName;

    private String description;

    private int durationDays;

    private boolean paid;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private AdvertisementStatus status;

    private String rejectionReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
