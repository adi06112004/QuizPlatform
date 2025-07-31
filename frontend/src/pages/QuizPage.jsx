import React, { useEffect, useState } from 'react';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false); // NEW state

  useEffect(() => {
    fetch('https://quizplatformbackend.onrender.com/api/quizzes')
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
    if (submitting) return;
    setSubmitting(true); // Prevent multiple clicks

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

    if (user) {
      try {
        await fetch('https://quizplatformbackend.onrender.com/api/submit-score', {
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

    setSubmitting(false);
  };

  if (!selectedQuiz) {
    return (
      <div className="container mt-5 text-center text-light">
        <h2 className="mb-4 animate__animated animate__fadeInDown">🧠 Choose a Quiz to Begin</h2>
        <div className="d-flex flex-column align-items-center">
          {quizzes.map((quiz, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedQuiz(quiz);
                setScore(null);
                setAnswers({});
              }}
              className="btn btn-outline-warning mb-3 px-4 py-2 shadow-sm w-50"
            >
              🚀 {quiz.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 text-light">
      <h3 className="mb-4 text-center fw-bold border-bottom pb-2">{selectedQuiz.title}</h3>

      {selectedQuiz.questions.map((q, index) => (
        <div key={index} className="card bg-dark text-light mb-4 shadow-lg">
          <div className="card-body">
            <h5 className="card-title mb-3">Q{index + 1}. {q.question}</h5>
            {q.options.map((opt, i) => (
              <div className="form-check mb-2" key={i}>
                <input
                  className="form-check-input"
                  type="radio"
                  name={`q-${index}`}
                  id={`q-${index}-opt-${i}`}
                  value={opt}
                  checked={answers[index] === opt}
                  onChange={() => handleAnswerChange(index, opt)}
                  disabled={submitting}
                />
                <label className="form-check-label" htmlFor={`q-${index}-opt-${i}`}>
                  {opt}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="d-flex mb-4 justify-content-center">
        <button
          onClick={submitQuiz}
          className="btn btn-success px-4 py-2 fw-semibold shadow"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" />
              Submitting...
            </>
          ) : (
            '✅ Submit Quiz'
          )}
        </button>
      </div>

      {score !== null && (
        <div className="alert alert-info mt-4 text-center animate__animated animate__fadeInUp">
          <h5>🎯 <strong>Your Score:</strong> {score} / {selectedQuiz.questions.length}</h5>
          <p className="mb-0">
            {score === selectedQuiz.questions.length
              ? '💯 Perfect!'
              : score >= selectedQuiz.questions.length / 2
              ? '👍 Good Job!'
              : '📖 Keep Practicing!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
