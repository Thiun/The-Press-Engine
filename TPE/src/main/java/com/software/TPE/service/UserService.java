package com.software.TPE.service;

import com.software.TPE.dto.*;
import com.software.TPE.exception.BadRequestException;
import com.software.TPE.exception.ResourceNotFoundException;
import com.software.TPE.exception.UnauthorizedException;
import com.software.TPE.model.User;
import com.software.TPE.model.UserAction;
import com.software.TPE.model.UserRole;
import com.software.TPE.model.UserStatus;
import com.software.TPE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto register(UserRegistrationRequest request) {
        String normalizedEmail = request.email().toLowerCase(Locale.ROOT);
        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            throw new BadRequestException("El correo ya se encuentra registrado");
        });

        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .name(request.name())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.password()))
                .role(UserRole.READER)
                .status(UserStatus.ACTIVE)
                .build();

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new UnauthorizedException("Credenciales incorrectas"));

        if (user.getStatus() == UserStatus.BANNED) {
            throw new UnauthorizedException("Tu cuenta ha sido suspendida. Contacta a soporte.");
        }

        if (user.getStatus() == UserStatus.DELETED) {
            throw new UnauthorizedException("La cuenta asociada a este correo ha sido eliminada.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Credenciales incorrectas");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String tokenPayload = user.getId() + ":" + System.currentTimeMillis();
        String token = Base64.getEncoder().encodeToString(tokenPayload.getBytes(StandardCharsets.UTF_8));

        return new LoginResponse(toDto(user), token);
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public UserDto updateRole(String userId, UpdateUserRoleRequest request) {
        User user = getUser(userId);
        user.setRole(request.role());
        return toDto(userRepository.save(user));
    }

    public UserDto applyAction(String userId, UserActionRequest request) {
        User user = getUser(userId);
        UserAction action;
        try {
            action = UserAction.valueOf(request.accion().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Acción de usuario no soportada: " + request.accion());
        }

        switch (action) {
            case BAN -> user.setStatus(UserStatus.BANNED);
            case UNBAN -> user.setStatus(UserStatus.ACTIVE);
            case DELETE -> user.setStatus(UserStatus.DELETED);
        }

        return toDto(userRepository.save(user));
    }

    public UserDto getById(String userId) {
        return toDto(getUser(userId));
    }

    private User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }
}
