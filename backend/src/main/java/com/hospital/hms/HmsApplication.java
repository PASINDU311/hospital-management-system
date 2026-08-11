package com.hospital.hms;

import com.hospital.hms.model.Doctor;
import com.hospital.hms.model.Role;
import com.hospital.hms.model.User;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@SpringBootApplication
public class HmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HmsApplication.class, args);
    }

    @Bean
    CommandLineRunner run(UserRepository userRepository, DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("doctor@hms.com").isEmpty()) {
                User user = new User();
                user.setFullName("Dr. Nimal Silva");
                user.setEmail("doctor@hms.com");
                user.setPassword(passwordEncoder.encode("doctor123"));
                user.setPhone("0779998877");
                user.setRole(Role.DOCTOR);
                user.setActive(true);
                user.setCreatedAt(LocalDateTime.now());
                User savedUser = userRepository.save(user);

                Doctor doctor = new Doctor();
                doctor.setUser(savedUser);
                doctor.setDoctorId("DOC-101");
                doctor.setSpecialization("Cardiologist");
                doctor.setSlmcRegisterNo("SLMC-85491");
                doctor.setConsultationFee(new BigDecimal("2500.00"));
                doctor.setAvailableDays("Monday,Wednesday,Friday");
                doctorRepository.save(doctor);

                System.out.println(">>> Sample Doctor Created: DOC-101 (doctor@hms.com) <<<");
            }
        };
    }
}