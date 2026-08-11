package com.hospital.hms.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RegisterDoctorRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String specialization;
    private String slmcRegisterNo;
    private BigDecimal consultationFee;
    private String availableDays;
}