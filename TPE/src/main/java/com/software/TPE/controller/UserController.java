package com.software.TPE.controller;

import com.software.TPE.dto.*;
import com.software.TPE.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserDto user = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> findById(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getById(userId));
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<UserDto> updateRole(@PathVariable String userId,
                                              @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(userService.updateRole(userId, request));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> applyAction(@PathVariable String userId,
                                               @Valid @RequestBody UserActionRequest request) {
        return ResponseEntity.ok(userService.applyAction(userId, request));
    }
}
