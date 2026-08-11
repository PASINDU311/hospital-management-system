package com.hospital.hms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    private String symptoms;

    @Column(nullable = false)
    private String diagnosis;

    @Column(length = 2000)
    private String prescription; // e.g., "Paracetamol 500mg - 2 times daily"

    private String doctorNotes;

    private LocalDateTime createdAt;
}