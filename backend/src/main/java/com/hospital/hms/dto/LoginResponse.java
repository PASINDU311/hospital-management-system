package com.hospital.hms.dto;

import com.hospital.hms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String fullName;
    private Role role;
    private String patientId; // Patient කෙනෙක් නම් විතරක් ID එක එනවා
}