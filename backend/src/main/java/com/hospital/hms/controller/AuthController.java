package com.hospital.hms.controller;

import com.hospital.hms.dto.AuthResponse;
import com.hospital.hms.dto.LoginRequest;
import com.hospital.hms.dto.LoginResponse;
import com.hospital.hms.dto.PatientRegisterRequest;
import com.hospital.hms.model.Role;
import com.hospital.hms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/patient")
    public ResponseEntity<AuthResponse> registerPatient(@RequestBody PatientRegisterRequest request) {
        return new ResponseEntity<>(authService.registerPatient(request), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        
        // =========================================================================
        // 1. HARDCODED ADMIN CHECK (admin@gmail.com / admin)
        // =========================================================================
        if ("admin@gmail.com".equalsIgnoreCase(request.getEmail()) && "admin".equals(request.getPassword())) {
            
            // LoginResponse(token, email, fullName, role, patientId)
            LoginResponse adminResponse = new LoginResponse(
                "dummy-admin-jwt-token-12345", // Fake Token
                "admin@gmail.com",
                "System Administrator",
                Role.ADMIN,                    // Role Enum එක (ADMIN)
                null                           // Patient ID නැත
            );

            return ResponseEntity.ok(adminResponse);
        }

        // =========================================================================
        // 2. NORMAL USER LOGIN (DATABASE CHECK VIA AUTH SERVICE)
        // =========================================================================
        return ResponseEntity.ok(authService.login(request));
    }
}