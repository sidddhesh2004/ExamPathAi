import React, { useState, useEffect } from 'react';
import apiClient from './api/axios'; // <-- UPDATED IMPORT

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    // Uses apiClient, URL is now relative
    apiClient.get('/api/quiz')
      .then(response => setQuestions(response.data))
      .catch(error => console.error("Error fetching quiz questions:", error));
  }, []);

  useEffect(() => {
    if (quizFinished && result) {
      setLoadingRecs(true);
      // Uses apiClient, URL is now relative
      apiClient.get(`/api/careers/${result}`)
        .then(response => {
          setRecommendations(response.data);
          setLoadingRecs(false);
        })
        .catch(error => {
          console.error("Error fetching career recommendations:", error);
          setLoadingRecs(false);
        });
    }
  }, [quizFinished, result]);

  const handleAnswer = (agreed) => {
    const questionType = questions[currentQuestionIndex].type;
    const newScores = { ...scores };
    if (agreed) {
      newScores[questionType]++;
    }
    setScores(newScores);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      const highestScore = Math.max(...Object.values(newScores));
      const finalResult = Object.keys(newScores).find(key => newScores[key] === highestScore);
      setResult(finalResult);
      setQuizFinished(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setScores({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    setQuizFinished(false);
    setResult(null);
    setRecommendations([]);
  };

  const progress = questions.length > 0 ? ((currentQuestionIndex) / questions.length) * 100 : 0;

  if (quizFinished) {
    return (
      <div className="results-card">
        <h2>Quiz Finished!</h2>
        <p>Your dominant personality type is: <strong>{result}</strong></p>
        <hr style={{margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--border-color)'}} />
        <h3>Recommended Career Paths:</h3>
        {loadingRecs ? <p>Loading recommendations...</p> : (
          <ul className="recommendations-list">
            {recommendations.map((career, index) => (
              <li key={index}>
                <strong>{career.title}:</strong> {career.description}
              </li>
            ))}
          </ul>
        )}
        <button className="btn-primary" onClick={handleRetakeQuiz}>Retake Quiz</button>
      </div>
    );
  }

  if (questions.length === 0) return <p>Loading quiz...</p>;

  return (
    <div className="quiz-container">
      <div className="progress-bar">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
      </div>
      <p style={{color: 'var(--light-text-color)', marginBottom: '0.5rem'}}>Question {currentQuestionIndex + 1}/{questions.length}</p>
      <h3>{questions[currentQuestionIndex].text}</h3>
      <div className="button-group">
        <button className="btn-primary" onClick={() => handleAnswer(true)}>Agree</button>
        <button className="btn-secondary" onClick={() => handleAnswer(false)}>Disagree</button>
      </div>
    </div>
  );
};

export default Quiz;