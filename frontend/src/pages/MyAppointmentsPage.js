import React, { useState } from 'react';
import { getAppointmentsByEmail, updateAppointmentStatus } from '../services/api';

export default function MyAppointmentsPage() {
  const [email, setEmail]             = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [searched, setSearched]       = useState(false);
  const [message, setMessage]         = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await getAppointmentsByEmail(email.trim());
      setAppointments(res.data);
      setSearched(true);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to fetch appointments.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await updateAppointmentStatus(id, status);
      setAppointments(prev =>
        prev.map(a => a.id === id ? res.data : a)
      );
      setMessage({ type: 'success', text: `Appointment #${id} marked as ${status}.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Update failed.' });
    }
  };

  const statusColor = (status) => {
    const map = {
      CONFIRMED: 'badge-confirmed',
      COMPLETED: 'badge-completed',
      CANCELLED: 'badge-cancelled',
      NO_SHOW:   'badge-no_show',
    };
    return map[status] || 'badge-confirmed';
  };

  return (
    <div className="page">
      <h1 className="page-title">My Appointments</h1>

      {/* Email search */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Search by Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'}`}>
          {message.text}
        </div>
      )}

      {searched && appointments.length === 0 && (
        <div className="alert alert-info">No appointments found for this email.</div>
      )}

      {appointments.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#4a5568' }}>
            {appointments.length} appointment(s) found
          </h3>

          {appointments.map(a => (
            <div key={a.id} className="appt-row">
              <div className="appt-info">
                <h4>{a.doctorName}</h4>
                <p>
                  {a.specialtyName} &nbsp;·&nbsp;
                  {a.mode === 'ONLINE' ? '💻 Online' : '🏥 Offline'} &nbsp;·&nbsp;
                  {a.appointmentDate} at {a.timeSlot}
                </p>
                <p>Patient: {a.patientName} &nbsp;·&nbsp; Fee: ₹{a.fee}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span className={`badge ${statusColor(a.status)}`}>{a.status}</span>

                {/* Status action buttons — shown based on current status */}
                {a.status === 'CONFIRMED' && (
                  <div className="appt-actions">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusUpdate(a.id, 'COMPLETED')}
                    >
                      ✓ Completed
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleStatusUpdate(a.id, 'CANCELLED')}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleStatusUpdate(a.id, 'NO_SHOW')}
                    >
                      No Show
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
