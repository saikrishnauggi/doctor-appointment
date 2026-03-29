package com.hospital.appointment.repository;

import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.model.AppointmentStatus;
import com.hospital.appointment.model.ConsultationMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Used by summary-service to get daily data
    List<Appointment> findByAppointmentDate(LocalDate date);

    // Check for duplicate booking (same doctor, date, slot)
    boolean existsByDoctorIdAndAppointmentDateAndTimeSlot(Long doctorId, LocalDate date, String slot);

    List<Appointment> findByPatientEmail(String email);

    List<Appointment> findByDoctorId(Long doctorId);

    // For daily summary grouping
    List<Appointment> findByAppointmentDateAndMode(LocalDate date, ConsultationMode mode);

    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, AppointmentStatus status);
}
