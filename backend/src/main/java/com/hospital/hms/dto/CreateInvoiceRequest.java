package com.hospital.hms.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInvoiceRequest {
    private String appointmentNo;
    private BigDecimal hospitalFee;
}