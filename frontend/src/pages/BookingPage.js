import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById, getDoctorAvailability, bookAppointment } from '../services/api';

export default function BookingPage() {
  const { doctorId } = useParams();
  const navigate     = useNavigate();

  const [doctor, setDoctor]       = useState(null);
  const [slots, setSlots]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState(null);  // { type, text }

  const [form, setForm] = useState({
    patientName:  '',
    patientEmail: '',
    patientPhone: '',
    appointmentDate: '',
    timeSlot: '',
  });

  useEffect(() => {
    Promise.all([
      getDoctorById(doctorId),
      getDoctorAvailability(doctorId),
    ])
      .then(([docRes, slotRes]) => {
        setDoctor(docRes.data);
        setSlots(slotRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [doctorId]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSlot = (slot) => {
    setForm(prev => ({ ...prev, timeSlot: slot }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.timeSlot) {
      setMessage({ type: 'error', text: 'Please select a time slot.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await bookAppointment({
        ...form,
        doctorId: Number(doctorId),
      });
      setMessage({
        type: 'success',
        text: `Appointment confirmed! ID: #${res.data.id}. Mode: ${res.data.mode}. Slot: ${res.data.timeSlot}.`,
      });
      setForm({ patientName: '', patientEmail: '', patientPhone: '', appointmentDate: '', timeSlot: '' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Booking failed. Please try again.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner" />Loading...</div>;
  if (!doctor) return <div className="page"><div className="alert alert-error">Doctor not found.</div></div>;

  // Today's date as min for date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>

        {/* Doctor info panel */}
        <div className="card" style={{ position: 'sticky', top: '80px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{doctor.name}</h2>
          <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{doctor.qualification}</p>
          <span className={`badge badge-${doctor.mode.toLowerCase()}`}>
            {doctor.mode === 'ONLINE' ? '💻 Online' : '🏥 Offline'}
          </span>
          <p style={{ marginTop: '0.8rem', fontSize: '0.88rem', color: '#4a5568' }}>
            <strong>Specialty:</strong> {doctor.specialtyName}
          </p>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2b6cb0', marginTop: '0.5rem' }}>
            ₹{doctor.consultationFee}
          </p>
          {doctor.mode === 'ONLINE' && (
            <p style={{ marginTop: '0.8rem', fontSize: '0.82rem', background: '#ebf8ff', padding: '0.6rem', borderRadius: '8px', color: '#1a365d' }}>
              📹 This is a teleconsultation. You'll receive a video call link after booking.
            </p>
          )}
          {doctor.mode === 'OFFLINE' && (
            <p style={{ marginTop: '0.8rem', fontSize: '0.82rem', background: '#f0fff4', padding: '0.6rem', borderRadius: '8px', color: '#22543d' }}>
              🏥 Visit the clinic at your scheduled time.
            </p>
          )}
        </div>

        {/* Booking form */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Book Appointment</h2>

          {message && (
            <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>
              {message.text}
              {message.type === 'success' && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginLeft: '1rem' }}
                  onClick={() => navigate('/my-appointments')}
                >
                  View My Appointments
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name *</label>
              <input
                className="form-control"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                className="form-control"
                type="email"
                name="patientEmail"
                value={form.patientEmail}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                className="form-control"
                name="patientPhone"
                value={form.patientPhone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="form-group">
              <label>Appointment Date *</label>
              <input
                className="form-control"
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Time Slot *</label>
              <div className="slot-grid">
                {slots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-btn${form.timeSlot === slot ? ' selected' : ''}`}
                    onClick={() => handleSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {slots.length === 0 && (
                <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  No slots available for this doctor.
                </p>
              )}
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
