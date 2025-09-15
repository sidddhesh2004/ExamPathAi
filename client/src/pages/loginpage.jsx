import React, { useState } from 'react';
import apiClient from '../api/axios'; // <-- UPDATED IMPORT
import { Link } from 'react-router-dom';
import './PageStyles.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Uses apiClient, URL is now relative
      const response = await apiClient.post('/api/login', { username, password });
      localStorage.setItem('token', response.data.access_token);
      onLoginSuccess();
    } catch (error) {
      setMessage(error.response?.data?.msg || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required disabled={isLoading} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required disabled={isLoading} />
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {message && <p className="auth-message">{message}</p>}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;