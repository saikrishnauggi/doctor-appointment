package com.hospital.specialty.controller;

import com.hospital.specialty.model.Specialty;
import com.hospital.specialty.service.SpecialtyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialties")
@CrossOrigin(origins = "*")
public class SpecialtyController {

    @Autowired
    private SpecialtyService specialtyService;

    // GET /api/specialties
    @GetMapping
    public List<Specialty> getAllSpecialties() {
        return specialtyService.getAllSpecialties();
    }

    // GET /api/specialties/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Specialty> getById(@PathVariable Long id) {
        return specialtyService.getSpecialtyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/specialties  (admin use)
    @PostMapping
    public Specialty create(@RequestBody Specialty specialty) {
        return specialtyService.createSpecialty(specialty);
    }
}
