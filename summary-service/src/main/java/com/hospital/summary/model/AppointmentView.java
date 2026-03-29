package com.hospital.summary.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

// Read-only mirror of the appointments table (owned by appointment-service)
@Entity
@Table(name = "appointments")
@Data
public class AppointmentView {

    @Id
    private Long id;

    private String patientName;
    private String patientEmail;
    private Long doctorId;
    private String doctorName;
    private String specialtyName;

    @Enumerated(EnumType.STRING)
    private ConsultationMode mode;

    private LocalDate appointmentDate;
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private LocalDateTime createdAt;
    private Double fee;
}
