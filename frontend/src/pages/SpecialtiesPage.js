import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecialties } from '../services/api';

const ICONS = {
  'Cardiology':       '❤️',
  'Dermatology':      '🧴',
  'Orthopedics':      '🦴',
  'Neurology':        '🧠',
  'General Medicine': '🩺',
};

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSpecialties()
      .then(res => setSpecialties(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id) => {
    navigate(`/doctors?specialtyId=${id}`);
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Loading specialties...
    </div>
  );

  return (
    <div className="page">
      <h1 className="page-title">Browse by Specialty</h1>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Choose a specialty to find the right doctor for you.
      </p>
      <div className="grid-3">
        {specialties.map(s => (
          <div
            key={s.id}
            className="card"
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => handleSelect(s.id)}
          >
            <div style={{ fontSize: '3rem', marginBottom: '0.7rem' }}>
              {ICONS[s.name] || '🏥'}
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{s.name}</h3>
            <p style={{ color: '#718096', fontSize: '0.88rem' }}>{s.description}</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              Find Doctors →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
