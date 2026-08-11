package com.hospital.hms.dto;

import com.hospital.hms.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class InvoiceResponse {
    private String invoiceNo;
    private String appointmentNo;
    private String patientName;
    private String doctorName;
    private BigDecimal doctorFee;
    private BigDecimal hospitalFee;
    private BigDecimal totalAmount;
    private PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
}