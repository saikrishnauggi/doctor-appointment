package com.hospital.doctor.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String qualification;   // e.g. "MBBS, MD"

    private Long specialtyId;       // FK reference to specialty-service

    private String specialtyName;   // denormalized for quick display

    // ONLINE = teleconsultation, OFFLINE = in-clinic
    // STRICT RULE: same doctor cannot be both ONLINE and OFFLINE
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConsultationMode mode;

    private String availableSlots;  // comma-separated: "09:00,10:00,11:00"

    private Double consultationFee;

    private String profileImage;
}
