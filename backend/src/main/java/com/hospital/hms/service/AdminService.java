package com.hospital.hms.service;

import com.hospital.hms.dto.DashboardStatsResponse;
import com.hospital.hms.dto.RegisterDoctorRequest;
import com.hospital.hms.model.*;
import com.hospital.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String registerDoctor(RegisterDoctorRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.DOCTOR);
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setDoctorId("DOC-" + (100 + new Random().nextInt(900)));
        doctor.setSpecialization(request.getSpecialization());
        doctor.setSlmcRegisterNo(request.getSlmcRegisterNo());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAvailableDays(request.getAvailableDays());

        doctorRepository.save(doctor);

        return "Doctor registered successfully with Doctor ID: " + doctor.getDoctorId();
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();

        BigDecimal totalRevenue = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getStatus() == PaymentStatus.PAID)
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardStatsResponse(totalPatients, totalDoctors, totalAppointments, totalRevenue);
    }
}