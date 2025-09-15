import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // <-- UPDATED IMPORT
import { useParams, Link } from 'react-router-dom';
import './PageStyles.css';

const ExamDetailPage = () => {
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Uses apiClient, URL is now relative and dynamic
    apiClient.get(`/api/exams/${examId}`)
      .then(response => {
        setExamDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching exam details:", error);
        setLoading(false);
      });
  }, [examId]);

  if (loading) return <p>Loading exam details...</p>;
  if (!examDetails) return <p>Exam not found.</p>;

  return (
    <div className="page-container">
      <Link to="/exams" className="back-link">&larr; Back to Exams List</Link>
      <h2>{examDetails.fullName} ({examDetails.name})</h2>
      <p className="exam-description">{examDetails.description}</p>
      
      <h3>Syllabus and Sections</h3>
      <div className="sections-container">
        {examDetails.sections.map((section, index) => (
          <div key={index} className="section-card">
            <h4>{section.name}</h4>
            <p>{section.syllabus}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamDetailPage;
