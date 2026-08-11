package com.hospital.hms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientRegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String nicOrPassport;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String emergencyContact;
}