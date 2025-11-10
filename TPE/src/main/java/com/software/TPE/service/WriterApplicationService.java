package com.software.TPE.service;

import com.software.TPE.dto.WriterApplicationRequest;
import com.software.TPE.dto.WriterApplicationResponse;
import com.software.TPE.dto.WriterApplicationUpdateRequest;
import com.software.TPE.exception.BadRequestException;
import com.software.TPE.exception.ResourceNotFoundException;
import com.software.TPE.model.User;
import com.software.TPE.model.UserRole;
import com.software.TPE.model.UserStatus;
import com.software.TPE.model.WriterApplication;
import com.software.TPE.model.WriterApplicationStatus;
import com.software.TPE.repository.UserRepository;
import com.software.TPE.repository.WriterApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WriterApplicationService {

    private final WriterApplicationRepository writerApplicationRepository;
    private final UserRepository userRepository;

    public WriterApplicationResponse create(WriterApplicationRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("El usuario no puede enviar solicitudes en este momento");
        }

        if (user.getRole() == UserRole.WRITER || user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("El usuario ya cuenta con privilegios para escribir");
        }

        writerApplicationRepository.findByUserIdAndEstadoIn(
                user.getId(),
                List.of(WriterApplicationStatus.PENDIENTE)
        ).ifPresent(existing -> {
            throw new BadRequestException("Ya tienes una solicitud pendiente de revisión");
        });

        WriterApplication application = WriterApplication.builder()
                .id(UUID.randomUUID().toString())
                .userId(user.getId())
                .userName(request.userName())
                .userEmail(request.userEmail().toLowerCase(Locale.ROOT))
                .motivacion(request.motivacion())
                .estado(WriterApplicationStatus.PENDIENTE)
                .build();

        WriterApplication saved = writerApplicationRepository.save(application);
        return toResponse(saved);
    }

    public List<WriterApplicationResponse> findAll() {
        return writerApplicationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public WriterApplicationResponse updateEstado(String solicitudId, WriterApplicationUpdateRequest request) {
        WriterApplication application = writerApplicationRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

        application.setEstado(request.estado());
        return toResponse(writerApplicationRepository.save(application));
    }

    private WriterApplicationResponse toResponse(WriterApplication application) {
        return new WriterApplicationResponse(
                application.getId(),
                application.getUserId(),
                application.getUserName(),
                application.getUserEmail(),
                application.getMotivacion(),
                application.getEstado().name().toLowerCase(Locale.ROOT),
                application.getFechaSolicitud()
        );
    }
}
