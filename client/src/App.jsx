import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// Import our components and pages
import Quiz from './Quiz';
import ExamsListPage from './pages/ExamsListPage';
import ExamDetailPage from './pages/ExamDetailPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// --- Polished Navigation Bar Component ---
function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav style={{ marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
      <Link to="/" className="nav-link">Career Quiz</Link>
      <Link to="/exams" className="nav-link">Exams</Link>
      
      {isLoggedIn ? (
        <button onClick={onLogout} className="btn-secondary nav-button">Logout</button>
      ) : (
        <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </>
      )}
    </nav>
  );
}


// --- Main App Component ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check for token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/'); // Redirect to home page after login
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
      <h1>Career Guide App</h1>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/exams" element={<ExamsListPage />} />
        <Route path="/exams/:examId" element={<ExamDetailPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    </div>
  );
}

// We need to wrap App in another component to use useNavigate in the App component itself
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;