package com.hospital.hms.controller;

import com.hospital.hms.dto.DashboardStatsResponse;
import com.hospital.hms.dto.RegisterDoctorRequest;
import com.hospital.hms.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/doctors")
    public ResponseEntity<String> registerDoctor(@RequestBody RegisterDoctorRequest request) {
        return new ResponseEntity<>(adminService.registerDoctor(request), HttpStatus.CREATED);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}