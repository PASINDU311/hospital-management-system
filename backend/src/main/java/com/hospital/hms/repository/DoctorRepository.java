package com.hospital.hms.repository;

import com.hospital.hms.model.Doctor;
import com.hospital.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByDoctorId(String doctorId);
}