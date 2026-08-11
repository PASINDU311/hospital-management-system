package com.hospital.hms.repository;

import com.hospital.hms.model.Patient;
import com.hospital.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Unique Patient ID (උදා: P-10025) මගින් Patient සෙවීම
    Optional<Patient> findByPatientId(String patientId);

    // User Object එක හරහා Patient Profile එක සෙවීම
    Optional<Patient> findByUser(User user);
}