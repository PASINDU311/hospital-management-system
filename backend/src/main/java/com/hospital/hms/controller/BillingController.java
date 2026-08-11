package com.hospital.hms.controller;

import com.hospital.hms.dto.CreateInvoiceRequest;
import com.hospital.hms.dto.InvoiceResponse;
import com.hospital.hms.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;

    @PostMapping("/generate")
    public ResponseEntity<InvoiceResponse> generateInvoice(@RequestBody CreateInvoiceRequest request) {
        return new ResponseEntity<>(billingService.generateInvoice(request), HttpStatus.CREATED);
    }

    @PutMapping("/pay/{invoiceNo}")
    public ResponseEntity<InvoiceResponse> markAsPaid(@PathVariable String invoiceNo) {
        return ResponseEntity.ok(billingService.markAsPaid(invoiceNo));
    }

    @GetMapping("/appointment/{appointmentNo}")
    public ResponseEntity<InvoiceResponse> getInvoiceByAppointment(@PathVariable String appointmentNo) {
        return ResponseEntity.ok(billingService.getInvoiceByAppointment(appointmentNo));
    }
}