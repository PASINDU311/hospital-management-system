package com.hospital.hms.repository;

import com.hospital.hms.model.Appointment;
import com.hospital.hms.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByAppointment(Appointment appointment);
    Optional<Invoice> findByInvoiceNo(String invoiceNo);
}