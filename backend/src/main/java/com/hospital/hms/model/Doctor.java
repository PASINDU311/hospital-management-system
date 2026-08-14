package com.hospital.hms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @OneToOne(fetch = FetchType.EAGER) // EAGER දැම්මම User details එකපාරම Fetch වෙනවා
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "doctor", "hibernateLazyInitializer", "handler"}) // Infinite loop වැලැක්වීමට
    private User user;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private String specialization; // e.g., Cardiology, Neurologist

    @Column(nullable = false)
    private String slmcRegisterNo; // Medical Council License

    @Column(nullable = false)
    private BigDecimal consultationFee;

    private String availableDays; // e.g., "Monday,Wednesday,Friday"
}