import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // <-- UPDATED IMPORT
import { Link } from 'react-router-dom';
import './PageStyles.css';

const ExamsListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Uses apiClient, URL is now relative
    apiClient.get('/api/exams')
      .then(response => {
        setExams(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching exams:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading exams...</p>;

  return (
    <div className="page-container">
      <h2>Higher Education Exams</h2>
      <div className="card-grid">
        {exams.map(exam => (
          <Link to={`/exams/${exam.id}`} key={exam.id} className="card-link">
            <div className="exam-card">
              <h3>{exam.name}</h3>
              <p>{exam.fullName}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExamsListPage;
