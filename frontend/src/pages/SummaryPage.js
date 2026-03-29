import React, { useEffect, useState } from 'react';
import { getDailySummary } from '../services/api';

export default function SummaryPage() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate]       = useState(today);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchSummary = (d) => {
    setLoading(true);
    setError(null);
    getDailySummary(d)
      .then(res => setSummary(res.data))
      .catch(() => setError('Failed to load summary. Make sure all services are running.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSummary(date); }, [date]);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Daily Summary</h1>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <input
            type="date"
            className="form-control"
            style={{ width: 'auto' }}
            value={date}
            onChange={e => setDate(e.target.value)}
            max={today}
          />
          <button className="btn btn-primary btn-sm" onClick={() => fetchSummary(date)}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner" />Loading summary...</div>
      ) : summary ? (
        <>
          {/* Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Total Appointments</div>
              <div className="stat-value">{summary.totalAppointments}</div>
              <div className="stat-sub">on {summary.date}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Online</div>
              <div className="stat-value" style={{ color: '#2b6cb0' }}>{summary.onlineCount}</div>
              <div className="stat-sub">teleconsultations</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Offline</div>
              <div className="stat-value" style={{ color: '#38a169' }}>{summary.offlineCount}</div>
              <div className="stat-sub">in-clinic visits</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value" style={{ color: '#d69e2e' }}>₹{summary.totalRevenue.toLocaleString()}</div>
              <div className="stat-sub">Online: ₹{summary.onlineRevenue} · Offline: ₹{summary.offlineRevenue}</div>
            </div>
          </div>

          {/* Two-column breakdown */}
          <div className="grid-2">

            {/* By Specialty */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#4a5568' }}>
                Appointments by Specialty
              </h3>
              {Object.keys(summary.bySpecialty).length === 0 ? (
                <p style={{ color: '#a0aec0', fontSize: '0.88rem' }}>No data for this date.</p>
              ) : (
                Object.entries(summary.bySpecialty).map(([name, count]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.9rem' }}>{name}</span>
                    <span style={{ fontWeight: 700, color: '#2b6cb0' }}>{count}</span>
                  </div>
                ))
              )}
            </div>

            {/* By Status */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#4a5568' }}>
                Appointments by Status
              </h3>
              {Object.keys(summary.byStatus).length === 0 ? (
                <p style={{ color: '#a0aec0', fontSize: '0.88rem' }}>No data for this date.</p>
              ) : (
                Object.entries(summary.byStatus).map(([status, count]) => (
                  <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                    <span style={{ fontWeight: 700 }}>{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Revenue breakdown bar */}
          {summary.totalRevenue > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#4a5568' }}>
                Revenue Split: Online vs Offline
              </h3>
              <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '20px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(summary.onlineRevenue / summary.totalRevenue) * 100}%`,
                  background: '#2b6cb0',
                  height: '100%',
                  borderRadius: '999px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#718096' }}>
                <span>💻 Online: ₹{summary.onlineRevenue} ({Math.round((summary.onlineRevenue / summary.totalRevenue) * 100)}%)</span>
                <span>🏥 Offline: ₹{summary.offlineRevenue} ({Math.round((summary.offlineRevenue / summary.totalRevenue) * 100)}%)</span>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
