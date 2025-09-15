import React, { useState } from 'react';
import apiClient from '../api/axios'; // <-- UPDATED IMPORT
import { useNavigate } from 'react-router-dom';
import './PageStyles.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Uses apiClient, URL is now relative
      const response = await apiClient.post('/api/register', { username, password });
      setMessage(response.data.msg + " Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response.data.msg);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Register</h2>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" className="btn-primary">Register</button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
