package com.hospital.hms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private String specialization; // e.g., Cardiologist, Neurologist

    @Column(nullable = false)
    private String slmcRegisterNo; // Medical Council License

    @Column(nullable = false)
    private BigDecimal consultationFee;

    private String availableDays; // e.g., "Monday,Wednesday,Friday"
}