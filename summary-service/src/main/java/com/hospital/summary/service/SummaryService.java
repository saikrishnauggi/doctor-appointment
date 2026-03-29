package com.hospital.summary.service;

import com.hospital.summary.dto.DailySummaryResponse;
import com.hospital.summary.model.AppointmentView;
import com.hospital.summary.model.ConsultationMode;
import com.hospital.summary.repository.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SummaryService {

    @Autowired
    private SummaryRepository summaryRepository;

    public DailySummaryResponse getDailySummary(LocalDate date) {

        List<AppointmentView> appointments = summaryRepository.findByAppointmentDate(date);

        DailySummaryResponse summary = new DailySummaryResponse();
        summary.setDate(date);
        summary.setTotalAppointments(appointments.size());

        // Count by mode
        long onlineCount = appointments.stream()
                .filter(a -> a.getMode() == ConsultationMode.ONLINE)
                .count();
        long offlineCount = appointments.stream()
                .filter(a -> a.getMode() == ConsultationMode.OFFLINE)
                .count();
        summary.setOnlineCount(onlineCount);
        summary.setOfflineCount(offlineCount);

        // Revenue totals
        double totalRevenue = appointments.stream()
                .mapToDouble(a -> a.getFee() != null ? a.getFee() : 0.0)
                .sum();
        double onlineRevenue = appointments.stream()
                .filter(a -> a.getMode() == ConsultationMode.ONLINE)
                .mapToDouble(a -> a.getFee() != null ? a.getFee() : 0.0)
                .sum();
        double offlineRevenue = appointments.stream()
                .filter(a -> a.getMode() == ConsultationMode.OFFLINE)
                .mapToDouble(a -> a.getFee() != null ? a.getFee() : 0.0)
                .sum();
        summary.setTotalRevenue(totalRevenue);
        summary.setOnlineRevenue(onlineRevenue);
        summary.setOfflineRevenue(offlineRevenue);

        // Group by specialty
        Map<String, Long> bySpecialty = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getSpecialtyName() != null ? a.getSpecialtyName() : "Unknown",
                        Collectors.counting()
                ));
        summary.setBySpecialty(bySpecialty);

        // Group by status
        Map<String, Long> byStatus = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus() != null ? a.getStatus().name() : "UNKNOWN",
                        Collectors.counting()
                ));
        summary.setByStatus(byStatus);

        return summary;
    }
}
