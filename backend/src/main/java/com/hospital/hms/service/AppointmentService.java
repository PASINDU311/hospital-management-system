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
        Patient patient = patientRepository.findByPatientId(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found!"));

        Doctor doctor = doctorRepository.findByDoctorId(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found!"));

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
        Patient patient = patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found!"));

        return appointmentRepository.findByPatient(patient)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointments(String doctorId) {
        Doctor doctor = doctorRepository.findByDoctorId(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found!"));

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
                apt.getDoctor().getUser().getFullName(),
                apt.getDoctor().getSpecialization(),
                apt.getPatient().getUser().getFullName(),
                apt.getAppointmentDate(),
                apt.getAppointmentTime(),
                apt.getDoctor().getConsultationFee(),
                apt.getStatus(),
                apt.getNotes()
        );
    }
}