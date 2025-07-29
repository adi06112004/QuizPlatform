// File: src/pages/QuizPage.jsx
import React, { useEffect, useState } from 'react';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error(err));

    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleAnswerChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const submitQuiz = async () => {
    let correct = 0;
    selectedQuiz.questions.forEach((q, i) => {
      const userAns = answers[i];
      const correctAns = q.correctAnswer;
      if (
        userAns &&
        correctAns &&
        userAns.trim().toLowerCase() === correctAns.trim().toLowerCase()
      ) {
        correct++;
      }
    });
    setScore(correct);

    // Save score to backend
    if (user) {
      try {
        await fetch('http://localhost:5000/api/submit-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            quizId: selectedQuiz._id,
            quizTitle: selectedQuiz.title,
            score: correct,
            total: selectedQuiz.questions.length
          })
        });
      } catch (err) {
        console.error('Error saving score:', err);
      }
    }
  };

  if (!selectedQuiz) {
    return (
      <div className="container mt-4">
        <h4 className="mb-3">📝 Select a Quiz</h4>
        <div className="d-flex flex-column">
          {quizzes.map((quiz, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedQuiz(quiz);
                setScore(null);
                setAnswers({});
              }}
              className="btn btn-outline-primary mb-2"
            >
              {quiz.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">{selectedQuiz.title}</h4>

      {selectedQuiz.questions.map((q, index) => (
        <div key={index} className="mb-4">
          <p><strong>Q{index + 1}:</strong> {q.question}</p>
          {q.options.map((opt, i) => (
            <div className="form-check" key={i}>
              <input
                className="form-check-input"
                type="radio"
                name={`q-${index}`}
                id={`q-${index}-opt-${i}`}
                value={opt}
                checked={answers[index] === opt}
                onChange={() => handleAnswerChange(index, opt)}
              />
              <label className="form-check-label" htmlFor={`q-${index}-opt-${i}`}>
                {opt}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button onClick={submitQuiz} className="btn btn-success">
        Submit Quiz
      </button>

      {score !== null && (
        <div className="mt-4 alert alert-info">
          ✅ <strong>Your Score:</strong> {score} / {selectedQuiz.questions.length}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
