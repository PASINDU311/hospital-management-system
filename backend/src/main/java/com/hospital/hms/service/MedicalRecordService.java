package com.hospital.hms.service;

import com.hospital.hms.dto.CreateMedicalRecordRequest;
import com.hospital.hms.dto.MedicalRecordResponse;
import com.hospital.hms.model.Appointment;
import com.hospital.hms.model.AppointmentStatus;
import com.hospital.hms.model.MedicalRecord;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public MedicalRecordResponse addMedicalRecord(CreateMedicalRecordRequest request) {
        Appointment appointment = appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getAppointmentNo().equals(request.getAppointmentNo()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));

        MedicalRecord record = new MedicalRecord();
        record.setAppointment(appointment);
        record.setSymptoms(request.getSymptoms());
        record.setDiagnosis(request.getDiagnosis());
        record.setPrescription(request.getPrescription());
        record.setDoctorNotes(request.getDoctorNotes());
        record.setCreatedAt(LocalDateTime.now());

        // Update appointment status to COMPLETED automatically
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        MedicalRecord savedRecord = medicalRecordRepository.save(record);

        return mapToResponse(savedRecord);
    }

    public MedicalRecordResponse getRecordByAppointment(String appointmentNo) {
        Appointment appointment = appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getAppointmentNo().equals(appointmentNo))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));

        MedicalRecord record = medicalRecordRepository.findByAppointment(appointment)
                .orElseThrow(() -> new RuntimeException("Medical record not found for this appointment!"));

        return mapToResponse(record);
    }

    private MedicalRecordResponse mapToResponse(MedicalRecord record) {
        return new MedicalRecordResponse(
                record.getAppointment().getAppointmentNo(),
                record.getAppointment().getPatient().getUser().getFullName(),
                record.getAppointment().getDoctor().getUser().getFullName(),
                record.getSymptoms(),
                record.getDiagnosis(),
                record.getPrescription(),
                record.getDoctorNotes(),
                record.getCreatedAt()
        );
    }
}