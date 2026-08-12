package com.hospital.hms.controller;

import com.hospital.hms.dto.CreateMedicalRecordRequest;
import com.hospital.hms.dto.MedicalRecordResponse;
import com.hospital.hms.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecordResponse> addMedicalRecord(@RequestBody CreateMedicalRecordRequest request) {
        return new ResponseEntity<>(medicalRecordService.addMedicalRecord(request), HttpStatus.CREATED);
    }

    @GetMapping("/appointment/{appointmentNo}")
    public ResponseEntity<MedicalRecordResponse> getRecordByAppointment(@PathVariable String appointmentNo) {
        return ResponseEntity.ok(medicalRecordService.getRecordByAppointment(appointmentNo));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getPatientMedicalRecords(@PathVariable String patientId) {
        return ResponseEntity.ok(medicalRecordService.getPatientMedicalRecords(patientId));
    }
}