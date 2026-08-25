import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <NavbarComponent />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/booking/:movieId" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/history" element={<BookingHistoryPage />} />
            </Routes>
          </div>
          <footer className="bg-dark border-top border-secondary py-3 text-center text-secondary small mt-5">
            2026 IMDb Top 10 Cinema - FER202
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
