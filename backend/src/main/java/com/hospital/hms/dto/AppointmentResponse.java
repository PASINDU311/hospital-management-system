package com.hospital.hms.dto;

import com.hospital.hms.model.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    private String appointmentNo;
    private String doctorName;
    private String doctorSpecialization;
    private String patientName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private BigDecimal consultationFee;
    private AppointmentStatus status;
    private String notes;
}