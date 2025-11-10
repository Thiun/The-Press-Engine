package com.software.TPE.controller;

import com.software.TPE.dto.UploadResponse;
import com.software.TPE.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> upload(@RequestParam("image") MultipartFile file) {
        String imageUrl = fileStorageService.store(file);
        return ResponseEntity.ok(new UploadResponse(imageUrl));
    }
}
