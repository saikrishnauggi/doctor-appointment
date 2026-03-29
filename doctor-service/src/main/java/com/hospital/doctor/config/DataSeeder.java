package com.hospital.doctor.config;

import com.hospital.doctor.model.ConsultationMode;
import com.hospital.doctor.model.Doctor;
import com.hospital.doctor.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public void run(String... args) {
        if (doctorRepository.count() == 0) {
            // Cardiology (specialtyId=1)
            doctorRepository.save(new Doctor(null, "Dr. Arjun Sharma", "MBBS, MD (Cardiology)", 1L, "Cardiology", ConsultationMode.ONLINE, "09:00,10:00,11:00,14:00,15:00", 500.0, null));
            doctorRepository.save(new Doctor(null, "Dr. Priya Mehta", "MBBS, DM (Cardiology)", 1L, "Cardiology", ConsultationMode.OFFLINE, "10:00,11:00,14:00,16:00", 700.0, null));

            // Dermatology (specialtyId=2)
            doctorRepository.save(new Doctor(null, "Dr. Sneha Reddy", "MBBS, MD (Dermatology)", 2L, "Dermatology", ConsultationMode.ONLINE, "09:00,10:00,12:00,15:00", 400.0, null));
            doctorRepository.save(new Doctor(null, "Dr. Rahul Joshi", "MBBS, DVD", 2L, "Dermatology", ConsultationMode.OFFLINE, "10:00,11:00,14:00", 450.0, null));

            // Orthopedics (specialtyId=3)
            doctorRepository.save(new Doctor(null, "Dr. Kavitha Nair", "MBBS, MS (Ortho)", 3L, "Orthopedics", ConsultationMode.OFFLINE, "09:00,11:00,14:00,16:00", 600.0, null));
            doctorRepository.save(new Doctor(null, "Dr. Suresh Babu", "MBBS, DNB (Ortho)", 3L, "Orthopedics", ConsultationMode.ONLINE, "10:00,12:00,15:00", 550.0, null));

            // Neurology (specialtyId=4)
            doctorRepository.save(new Doctor(null, "Dr. Ananya Das", "MBBS, DM (Neurology)", 4L, "Neurology", ConsultationMode.ONLINE, "09:00,10:00,11:00", 800.0, null));

            // General Medicine (specialtyId=5)
            doctorRepository.save(new Doctor(null, "Dr. Vikram Singh", "MBBS, PGDM", 5L, "General Medicine", ConsultationMode.OFFLINE, "09:00,10:00,11:00,14:00,15:00,16:00", 300.0, null));
            doctorRepository.save(new Doctor(null, "Dr. Pooja Iyer", "MBBS", 5L, "General Medicine", ConsultationMode.ONLINE, "09:00,10:00,11:00,14:00,15:00", 250.0, null));

            System.out.println("Doctor data seeded.");
        }
    }
}
