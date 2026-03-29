package com.hospital.doctor.controller;

import com.hospital.doctor.model.Doctor;
import com.hospital.doctor.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    // GET /api/doctors
    // GET /api/doctors?specialtyId=1
    // GET /api/doctors?mode=ONLINE
    // GET /api/doctors?specialtyId=1&mode=ONLINE
    @GetMapping
    public List<Doctor> getDoctors(
            @RequestParam(required = false) Long specialtyId,
            @RequestParam(required = false) String mode) {
        return doctorService.filterDoctors(specialtyId, mode);
    }

    // GET /api/doctors/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/doctors/{id}/availability
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<String>> getAvailability(@PathVariable Long id) {
        List<String> slots = doctorService.getAvailability(id);
        if (slots.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(slots);
    }

    // POST /api/doctors  (admin use for seeding)
    @PostMapping
    public Doctor create(@RequestBody Doctor doctor) {
        return doctorService.createDoctor(doctor);
    }
}
