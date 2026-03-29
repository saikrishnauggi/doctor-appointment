import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; 

import SpecialtiesPage from './pages/SpecialtiesPage';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import SummaryPage from './pages/SummaryPage';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🏥 MediBook</Link>
      <ul className="navbar-links">
        <li><Link to="/">Specialties</Link></li>
        <li><Link to="/doctors">Doctors</Link></li>
        <li><Link to="/my-appointments">My Appointments</Link></li>
        <li><Link to="/summary">Admin Summary</Link></li>
      </ul>
    </nav>
  );
}

export default function App() {
  return (
    <> {/* Replaced BrowserRouter with a Fragment */}
      <Navbar />
      <Routes>
        <Route path="/" element={<SpecialtiesPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/book/:doctorId" element={<BookingPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </>
  );
}