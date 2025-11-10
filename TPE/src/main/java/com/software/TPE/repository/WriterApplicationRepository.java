package com.software.TPE.repository;

import com.software.TPE.model.WriterApplication;
import com.software.TPE.model.WriterApplicationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WriterApplicationRepository extends MongoRepository<WriterApplication, String> {
    Optional<WriterApplication> findByUserIdAndEstadoIn(String userId, List<WriterApplicationStatus> estados);
}
