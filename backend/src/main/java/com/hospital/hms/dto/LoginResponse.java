package com.hospital.hms.dto;

import com.hospital.hms.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String fullName;
    private Role role;
    private String patientId;
    private String doctorId;

    // Overloaded Constructor (පරණ AuthService code එක බඳින්නේ නැතුව කෙළින්ම වැඩ කරන්න)
    public LoginResponse(String token, String email, String fullName, Role role, String patientId) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.patientId = patientId;
        this.doctorId = null;
    }
}