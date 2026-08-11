package com.hospital.hms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String patientId; // උදා: P-10025

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String nicOrPassport;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String emergencyContact;
}