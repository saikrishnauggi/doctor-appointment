package com.hospital.specialty.config;

import com.hospital.specialty.model.Specialty;
import com.hospital.specialty.repository.SpecialtyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private SpecialtyRepository specialtyRepository;

    @Override
    public void run(String... args) {
        if (specialtyRepository.count() == 0) {
            specialtyRepository.save(new Specialty(null, "Cardiology", "Heart and cardiovascular system", null));
            specialtyRepository.save(new Specialty(null, "Dermatology", "Skin, hair and nails", null));
            specialtyRepository.save(new Specialty(null, "Orthopedics", "Bones, joints and muscles", null));
            specialtyRepository.save(new Specialty(null, "Neurology", "Brain and nervous system", null));
            specialtyRepository.save(new Specialty(null, "General Medicine", "General health concerns", null));
            System.out.println("Specialty data seeded.");
        }
    }
}
