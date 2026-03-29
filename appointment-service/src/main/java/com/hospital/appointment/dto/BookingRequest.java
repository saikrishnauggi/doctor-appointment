package com.hospital.appointment.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Long doctorId;
    private LocalDate appointmentDate;
    private String timeSlot;
}
