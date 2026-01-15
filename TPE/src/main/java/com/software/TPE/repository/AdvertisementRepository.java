package com.software.TPE.repository;

import com.software.TPE.model.Advertisement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdvertisementRepository extends MongoRepository<Advertisement, String> {
}
