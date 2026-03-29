package com.hospital.appointment.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Patient info
    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String patientEmail;

    private String patientPhone;

    // Doctor info (denormalized for display)
    @Column(nullable = false)
    private Long doctorId;

    private String doctorName;

    private String specialtyName;

    // ONLINE or OFFLINE - must match the doctor's mode
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConsultationMode mode;

    // Appointment date and selected time slot
    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private String timeSlot;     // e.g. "10:00"

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.CONFIRMED;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private Double fee;
}
