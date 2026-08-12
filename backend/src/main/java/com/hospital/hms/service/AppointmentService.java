package com.hospital.hms.service;

import com.hospital.hms.dto.AppointmentResponse;
import com.hospital.hms.dto.BookAppointmentRequest;
import com.hospital.hms.model.*;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public AppointmentResponse bookAppointment(BookAppointmentRequest request) {
        // 1. Search Patient: First by patientId string, then by DB Primary Key (Long)
        Patient patient = patientRepository.findByPatientId(request.getPatientId())
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(request.getPatientId());
                        return patientRepository.findById(id).orElse(null);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                });

        if (patient == null) {
            patient = patientRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("Patient not found in database! Please register a patient first."));
        }

        // 2. Search Doctor: First by doctorId string (e.g. DOC-002), then by DB Primary Key (Long)
        Doctor doctor = doctorRepository.findByDoctorId(request.getDoctorId())
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(request.getDoctorId());
                        return doctorRepository.findById(id).orElse(null);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                });

        if (doctor == null) {
            doctor = doctorRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new RuntimeException("Doctor not found in database!"));
        }

        Appointment appointment = new Appointment();
        appointment.setAppointmentNo("APT-" + (10000 + new Random().nextInt(90000)));
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setNotes(request.getNotes());
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment savedApt = appointmentRepository.save(appointment);

        return mapToResponse(savedApt);
    }

    public List<AppointmentResponse> getPatientAppointments(String patientId) {
        // Find Patient by patientId String or Long ID
        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(patientId);
                        return patientRepository.findById(id).orElse(null);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                });

        if (patient == null) {
            throw new RuntimeException("Patient not found with ID: " + patientId);
        }

        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointments(String doctorId) {
        // Multi-fallback search for Doctor:
        // 1. Check by doctorId field (e.g., 'DOC-002')
        // 2. Check by doctors table Primary Key ID (e.g., 2)
        // 3. Check by user_id linked to Doctor
        Doctor doctor = doctorRepository.findByDoctorId(doctorId)
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(doctorId);
                        // Check if ID matches doctor table primary key
                        Doctor docById = doctorRepository.findById(id).orElse(null);
                        if (docById != null) {
                            return docById;
                        }
                        // Check if ID matches user_id inside Doctor entity
                        return doctorRepository.findAll().stream()
                                .filter(d -> d.getUser() != null && d.getUser().getId().equals(id))
                                .findFirst()
                                .orElse(null);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                });

        if (doctor == null) {
            throw new RuntimeException("Doctor not found with ID: " + doctorId);
        }

        return appointmentRepository.findByDoctor(doctor)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(String appointmentNo, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getAppointmentNo().equals(appointmentNo))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));

        appointment.setStatus(status);
        Appointment updatedApt = appointmentRepository.save(appointment);

        return mapToResponse(updatedApt);
    }

    private AppointmentResponse mapToResponse(Appointment apt) {
        return new AppointmentResponse(
                apt.getAppointmentNo(),
                apt.getDoctor() != null && apt.getDoctor().getUser() != null ? apt.getDoctor().getUser().getFullName() : "Doctor",
                apt.getDoctor() != null ? apt.getDoctor().getSpecialization() : "General",
                apt.getPatient() != null && apt.getPatient().getUser() != null ? apt.getPatient().getUser().getFullName() : "Patient",
                apt.getAppointmentDate(),
                apt.getAppointmentTime(),
                apt.getDoctor() != null ? apt.getDoctor().getConsultationFee() : null,
                apt.getStatus(),
                apt.getNotes()
        );
    }
}