package com.hospital.hms.repository;

import com.hospital.hms.model.Appointment;
import com.hospital.hms.model.Doctor;
import com.hospital.hms.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);
}