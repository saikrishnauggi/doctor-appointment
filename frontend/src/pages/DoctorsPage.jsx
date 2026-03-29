import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDoctors, getSpecialties } from '../services/api';

export default function DoctorsPage() {
  const [doctors, setDoctors]         = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const specialtyId = searchParams.get('specialtyId') || '';
  const mode        = searchParams.get('mode') || '';

  useEffect(() => {
    getSpecialties().then(res => setSpecialties(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (specialtyId) params.specialtyId = specialtyId;
    if (mode)        params.mode        = mode;

    getDoctors(params)
      .then(res => setDoctors(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialtyId, mode]);

  const handleFilter = (key, value) => {
    const newParams = {};
    if (specialtyId) newParams.specialtyId = specialtyId;
    if (mode)        newParams.mode        = mode;
    if (value) newParams[key] = value;
    else delete newParams[key];
    setSearchParams(newParams);
  };

  return (
    <div className="page">
      <h1 className="page-title">Find a Doctor</h1>

      {/* Filter Bar */}
      <div className="filter-bar">
        <select
          value={specialtyId}
          onChange={e => handleFilter('specialtyId', e.target.value)}
        >
          <option value="">All Specialties</option>
          {specialties.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select
          value={mode}
          onChange={e => handleFilter('mode', e.target.value)}
        >
          <option value="">All Modes</option>
          <option value="ONLINE">Online (Teleconsultation)</option>
          <option value="OFFLINE">Offline (In-Clinic)</option>
        </select>

        {(specialtyId || mode) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSearchParams({})}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" />Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="alert alert-info">No doctors found for the selected filters.</div>
      ) : (
        <div className="grid-3">
          {doctors.map(d => (
            <div key={d.id} className="card doctor-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3>{d.name}</h3>
                  <p className="qualification">{d.qualification}</p>
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.4rem' }}>
                    {d.specialtyName}
                  </p>
                </div>
                <span className={`badge badge-${d.mode.toLowerCase()}`}>
                  {d.mode === 'ONLINE' ? '💻 Online' : '🏥 Offline'}
                </span>
              </div>
              <p className="fee">₹{d.consultationFee} / consultation</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => navigate(`/book/${d.id}`)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
