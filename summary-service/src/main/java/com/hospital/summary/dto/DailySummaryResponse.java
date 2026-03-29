package com.hospital.summary.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class DailySummaryResponse {

    private LocalDate date;

    // Total counts
    private long totalAppointments;
    private long onlineCount;
    private long offlineCount;

    // Revenue
    private double totalRevenue;
    private double onlineRevenue;
    private double offlineRevenue;

    // Count by specialty: {"Cardiology": 5, "Dermatology": 3, ...}
    private Map<String, Long> bySpecialty;

    // Count by status: {"CONFIRMED": 4, "COMPLETED": 6, ...}
    private Map<String, Long> byStatus;
}
