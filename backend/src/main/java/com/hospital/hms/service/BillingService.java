package com.hospital.hms.service;

import com.hospital.hms.dto.CreateInvoiceRequest;
import com.hospital.hms.dto.InvoiceResponse;
import com.hospital.hms.model.Appointment;
import com.hospital.hms.model.Invoice;
import com.hospital.hms.model.PaymentStatus;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public InvoiceResponse generateInvoice(CreateInvoiceRequest request) {
        Appointment appointment = appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getAppointmentNo().equals(request.getAppointmentNo()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));

        BigDecimal doctorFee = appointment.getDoctor().getConsultationFee();
        BigDecimal hospitalFee = request.getHospitalFee() != null ? request.getHospitalFee() : new BigDecimal("500.00");
        BigDecimal totalAmount = doctorFee.add(hospitalFee);

        Invoice invoice = new Invoice();
        invoice.setInvoiceNo("INV-" + (10000 + new Random().nextInt(90000)));
        invoice.setAppointment(appointment);
        invoice.setDoctorFee(doctorFee);
        invoice.setHospitalFee(hospitalFee);
        invoice.setTotalAmount(totalAmount);
        invoice.setStatus(PaymentStatus.UNPAID);
        invoice.setCreatedAt(LocalDateTime.now());

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToResponse(savedInvoice);
    }

    @Transactional
    public InvoiceResponse markAsPaid(String invoiceNo) {
        Invoice invoice = invoiceRepository.findByInvoiceNo(invoiceNo)
                .orElseThrow(() -> new RuntimeException("Invoice not found!"));

        invoice.setStatus(PaymentStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToResponse(updatedInvoice);
    }

    public InvoiceResponse getInvoiceByAppointment(String appointmentNo) {
        Appointment appointment = appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getAppointmentNo().equals(appointmentNo))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));

        Invoice invoice = invoiceRepository.findByAppointment(appointment)
                .orElseThrow(() -> new RuntimeException("Invoice not found for this appointment!"));

        return mapToResponse(invoice);
    }

    private InvoiceResponse mapToResponse(Invoice inv) {
        return new InvoiceResponse(
                inv.getInvoiceNo(),
                inv.getAppointment().getAppointmentNo(),
                inv.getAppointment().getPatient().getUser().getFullName(),
                inv.getAppointment().getDoctor().getUser().getFullName(),
                inv.getDoctorFee(),
                inv.getHospitalFee(),
                inv.getTotalAmount(),
                inv.getStatus(),
                inv.getCreatedAt(),
                inv.getPaidAt()
        );
    }
}