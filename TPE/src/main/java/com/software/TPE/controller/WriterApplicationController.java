package com.software.TPE.controller;

import com.software.TPE.dto.WriterApplicationRequest;
import com.software.TPE.dto.WriterApplicationResponse;
import com.software.TPE.dto.WriterApplicationUpdateRequest;
import com.software.TPE.service.WriterApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class WriterApplicationController {

    private final WriterApplicationService writerApplicationService;

    @PostMapping
    public ResponseEntity<WriterApplicationResponse> create(@Valid @RequestBody WriterApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(writerApplicationService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<WriterApplicationResponse>> findAll() {
        return ResponseEntity.ok(writerApplicationService.findAll());
    }

    @PutMapping("/{solicitudId}")
    public ResponseEntity<WriterApplicationResponse> update(@PathVariable String solicitudId,
                                                            @Valid @RequestBody WriterApplicationUpdateRequest request) {
        return ResponseEntity.ok(writerApplicationService.updateEstado(solicitudId, request));
    }
}
