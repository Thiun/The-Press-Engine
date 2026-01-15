package com.software.TPE.controller;

import com.software.TPE.dto.AdvertisementResponse;
import com.software.TPE.dto.AdvertisementUpdateRequest;
import com.software.TPE.service.AdvertisementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advertisements")
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    @GetMapping
    public ResponseEntity<List<AdvertisementResponse>> findAll() {
        return ResponseEntity.ok(advertisementService.findAll());
    }

    @PutMapping("/{adId}")
    public ResponseEntity<AdvertisementResponse> update(@PathVariable String adId,
                                                        @Valid @RequestBody AdvertisementUpdateRequest request) {
        return ResponseEntity.ok(advertisementService.updateStatus(adId, request));
    }

    @DeleteMapping("/{adId}")
    public ResponseEntity<Void> delete(@PathVariable String adId) {
        advertisementService.delete(adId);
        return ResponseEntity.noContent().build();
    }
}
