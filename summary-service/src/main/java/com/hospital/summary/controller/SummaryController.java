package com.hospital.summary.controller;

import com.hospital.summary.dto.DailySummaryResponse;
import com.hospital.summary.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "*")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    // GET /api/summary/daily          → today's summary
    // GET /api/summary/daily?date=2026-03-29  → specific date
    @GetMapping("/daily")
    public DailySummaryResponse getDailySummary(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if (date == null) date = LocalDate.now();
        return summaryService.getDailySummary(date);
    }
}
