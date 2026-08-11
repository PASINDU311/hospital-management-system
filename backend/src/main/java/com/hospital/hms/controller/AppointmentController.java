package com.hospital.hms.controller;

import com.hospital.hms.dto.AppointmentResponse;
import com.hospital.hms.dto.BookAppointmentRequest;
import com.hospital.hms.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(@RequestBody BookAppointmentRequest request) {
        return new ResponseEntity<>(appointmentService.bookAppointment(request), HttpStatus.CREATED);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(@PathVariable String patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }
}