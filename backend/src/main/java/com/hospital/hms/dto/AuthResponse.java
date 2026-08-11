package com.hospital.hms.dto;

import com.hospital.hms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String patientId;
    private String email;
    private Role role;
}