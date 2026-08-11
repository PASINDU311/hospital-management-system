package com.hospital.hms.dto;

import lombok.Data;

@Data
public class CreateMedicalRecordRequest {
    private String appointmentNo;
    private String symptoms;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;
}