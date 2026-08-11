package com.hospital.hms.service;

import com.hospital.hms.dto.AuthResponse;
import com.hospital.hms.dto.PatientRegisterRequest;
import com.hospital.hms.model.Patient;
import com.hospital.hms.model.Role;
import com.hospital.hms.model.User;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse registerPatient(PatientRegisterRequest request) {
        // 1. Email validation
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address is already registered!");
        }

        // 2. Create User Account
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(Role.PATIENT);
        user.setActive(true);

        User savedUser = userRepository.save(user);

        // 3. Create Patient Profile
        Patient patient = new Patient();
        patient.setUser(savedUser);
        patient.setNicOrPassport(request.getNicOrPassport());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());
        patient.setEmergencyContact(request.getEmergencyContact());
        
        // Generate Unique Patient ID (e.g., P-10025)
        patient.setPatientId(generateUniquePatientId());

        Patient savedPatient = patientRepository.save(patient);

        return new AuthResponse(
                "Patient registered successfully!",
                savedPatient.getPatientId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    private String generateUniquePatientId() {
        Random random = new Random();
        int randomNumber = 10000 + random.nextInt(90000); // Generates 5 digit number
        String generatedId = "P-" + randomNumber;

        // Ensure uniqueness
        while (patientRepository.findByPatientId(generatedId).isPresent()) {
            randomNumber = 10000 + random.nextInt(90000);
            generatedId = "P-" + randomNumber;
        }

        return generatedId;
    }
}