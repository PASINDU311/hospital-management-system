package com.hospital.hms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MedicalRecordResponse {
    private String appointmentNo;
    private String patientName;
    private String doctorName;
    private String symptoms;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;
    private LocalDateTime createdAt;
}