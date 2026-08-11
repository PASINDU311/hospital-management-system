package com.hospital.hms.repository;

import com.hospital.hms.model.Appointment;
import com.hospital.hms.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    Optional<MedicalRecord> findByAppointment(Appointment appointment);
}