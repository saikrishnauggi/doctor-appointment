import axios from 'axios';

// All requests go through the API Gateway on port 8080
const API = axios.create({
  baseURL: 'http://localhost:8080',
});

// ─── Specialties ─────────────────────────────────────────────
export const getSpecialties = () => API.get('/api/specialties');

// ─── Doctors ─────────────────────────────────────────────────
export const getDoctors = (params = {}) => API.get('/api/doctors', { params });
// params: { specialtyId, mode }

export const getDoctorById = (id) => API.get(`/api/doctors/${id}`);

export const getDoctorAvailability = (id) => API.get(`/api/doctors/${id}/availability`);

// ─── Appointments ─────────────────────────────────────────────
export const bookAppointment = (data) => API.post('/api/appointments', data);

export const getAppointmentById = (id) => API.get(`/api/appointments/${id}`);

export const getAppointmentsByEmail = (email) => API.get('/api/appointments', { params: { email } });

export const updateAppointmentStatus = (id, status) =>
  API.put(`/api/appointments/${id}/status`, { status });

// ─── Summary ─────────────────────────────────────────────────
export const getDailySummary = (date) =>
  API.get('/api/summary/daily', date ? { params: { date } } : {});
