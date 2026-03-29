package com.hospital.doctor.service;

import com.hospital.doctor.model.ConsultationMode;
import com.hospital.doctor.model.Doctor;
import com.hospital.doctor.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    // Filter by specialtyId and/or mode
    public List<Doctor> filterDoctors(Long specialtyId, String mode) {
        if (specialtyId != null && mode != null) {
            return doctorRepository.findBySpecialtyIdAndMode(specialtyId, ConsultationMode.valueOf(mode.toUpperCase()));
        } else if (specialtyId != null) {
            return doctorRepository.findBySpecialtyId(specialtyId);
        } else if (mode != null) {
            return doctorRepository.findByMode(ConsultationMode.valueOf(mode.toUpperCase()));
        }
        return doctorRepository.findAll();
    }

    // Returns available slots as a list of strings
    public List<String> getAvailability(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .map(d -> Arrays.asList(d.getAvailableSlots().split(",")))
                .orElse(List.of());
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }
}
