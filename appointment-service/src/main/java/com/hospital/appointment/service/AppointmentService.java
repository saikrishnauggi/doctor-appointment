package com.hospital.appointment.service;

import com.hospital.appointment.dto.BookingRequest;
import com.hospital.appointment.dto.StatusUpdateRequest;
import com.hospital.appointment.model.Appointment;
import com.hospital.appointment.model.AppointmentStatus;
import com.hospital.appointment.model.ConsultationMode;
import com.hospital.appointment.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${doctor.service.url}")
    private String doctorServiceUrl;

    @SuppressWarnings("unchecked")
    public Appointment bookAppointment(BookingRequest req) {

        // 1. Fetch doctor info from doctor-service
        String url = doctorServiceUrl + "/api/doctors/" + req.getDoctorId();
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map<String, Object> doctor = response.getBody();

        if (doctor == null) {
            throw new RuntimeException("Doctor not found with id: " + req.getDoctorId());
        }

        // 2. Check for duplicate slot
        boolean alreadyBooked = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndTimeSlot(
                        req.getDoctorId(), req.getAppointmentDate(), req.getTimeSlot());
        if (alreadyBooked) {
            throw new RuntimeException("This slot is already booked. Please choose another time.");
        }

        // 3. Build appointment
        Appointment appointment = new Appointment();
        appointment.setPatientName(req.getPatientName());
        appointment.setPatientEmail(req.getPatientEmail());
        appointment.setPatientPhone(req.getPatientPhone());
        appointment.setDoctorId(req.getDoctorId());
        appointment.setDoctorName((String) doctor.get("name"));
        appointment.setSpecialtyName((String) doctor.get("specialtyName"));
        appointment.setMode(ConsultationMode.valueOf((String) doctor.get("mode")));
        appointment.setAppointmentDate(req.getAppointmentDate());
        appointment.setTimeSlot(req.getTimeSlot());
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment.setFee(doctor.get("consultationFee") != null
                ? ((Number) doctor.get("consultationFee")).doubleValue() : 0.0);

        return appointmentRepository.save(appointment);
    }

    public Optional<Appointment> getById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getByPatientEmail(String email) {
        return appointmentRepository.findByPatientEmail(email);
    }

    public Appointment updateStatus(Long id, StatusUpdateRequest req) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appt.setStatus(AppointmentStatus.valueOf(req.getStatus().toUpperCase()));
        return appointmentRepository.save(appt);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
