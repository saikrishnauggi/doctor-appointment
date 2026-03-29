package com.hospital.appointment.controller;

import com.hospital.appointment.dto.BookingRequest;
import com.hospital.appointment.dto.StatusUpdateRequest;
import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // POST /api/appointments  — book an appointment
    @PostMapping
    public ResponseEntity<?> book(@RequestBody BookingRequest req) {
        try {
            Appointment appt = appointmentService.bookAppointment(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(appt);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/appointments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getById(@PathVariable Long id) {
        return appointmentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/appointments?email=patient@email.com
    @GetMapping
    public List<Appointment> getByEmail(@RequestParam(required = false) String email) {
        if (email != null) return appointmentService.getByPatientEmail(email);
        return appointmentService.getAllAppointments();
    }

    // PUT /api/appointments/{id}/status  — mark COMPLETED, CANCELLED, NO_SHOW
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody StatusUpdateRequest req) {
        try {
            Appointment updated = appointmentService.updateStatus(id, req);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
