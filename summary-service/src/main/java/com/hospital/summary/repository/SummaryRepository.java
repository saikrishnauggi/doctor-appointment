package com.hospital.summary.repository;

import com.hospital.summary.model.AppointmentView;
import com.hospital.summary.model.ConsultationMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SummaryRepository extends JpaRepository<AppointmentView, Long> {

    List<AppointmentView> findByAppointmentDate(LocalDate date);

    List<AppointmentView> findByAppointmentDateAndMode(LocalDate date, ConsultationMode mode);

    // Total revenue for a given date
    @Query("SELECT COALESCE(SUM(a.fee), 0) FROM AppointmentView a WHERE a.appointmentDate = :date")
    Double getTotalRevenueByDate(@Param("date") LocalDate date);

    // Revenue grouped by mode for a given date
    @Query("SELECT COALESCE(SUM(a.fee), 0) FROM AppointmentView a WHERE a.appointmentDate = :date AND a.mode = :mode")
    Double getRevenueByDateAndMode(@Param("date") LocalDate date, @Param("mode") ConsultationMode mode);

    // Count by specialty for a given date
    @Query("SELECT a.specialtyName, COUNT(a) FROM AppointmentView a WHERE a.appointmentDate = :date GROUP BY a.specialtyName")
    List<Object[]> countBySpecialtyForDate(@Param("date") LocalDate date);
}
