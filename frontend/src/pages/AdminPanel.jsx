import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = () => {
    fetch('https://quizplatformbackend.onrender.com/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  const fetchQuizzes = () => {
    fetch('https://quizplatformbackend.onrender.com/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
    fetchQuizzes();
  }, []);

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const submitQuiz = async () => {
    const newQuiz = { title: quizTitle, questions };
    setSubmitting(true);

    try {
      const res = await fetch('https://quizplatformbackend.onrender.com/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz)
      });

      if (!res.ok) throw new Error('Failed to save quiz');

      alert('✅ Quiz saved successfully!');
      setQuizTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
      fetchQuizzes(); // Refresh quizzes
    } catch (err) {
      console.error(err);
      alert('❌ Error saving quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://quizplatformbackend.onrender.com/api/quizzes/${quizId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete quiz');
      alert('🗑️ Quiz deleted successfully!');
      fetchQuizzes(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('❌ Error deleting quiz.');
    }
  };

  return (
    <div className="container py-4 bg-dark text-light min-vh-100">
      <div className="p-4 rounded shadow border border-secondary mb-5">
        <h3 className="mb-4 text-info">🛠️ Create New Quiz</h3>

        <div className="mb-4">
          <label className="form-label fw-semibold">Quiz Title</label>
          <input
            className="form-control text-black border-secondary"
            placeholder="Enter Quiz Title"
            value={quizTitle}
            onChange={e => setQuizTitle(e.target.value)}
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="card bg-secondary border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3 text-light">📌 Question {qIndex + 1}</h5>
              <input
                className="form-control mb-3 text-black border-light"
                placeholder="Enter question"
                value={q.question}
                onChange={e => handleChange(qIndex, 'question', e.target.value)}
              />
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  className="form-control mb-2 text-black border-light"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={e => handleOptionChange(qIndex, i, e.target.value)}
                />
              ))}
              <input
                className="form-control mt-3 text-black border-light"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={e => handleChange(qIndex, 'correctAnswer', e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="d-flex gap-2">
          <button className="btn btn-outline-light" onClick={addQuestion} disabled={submitting}>
            ➕ Add Question
          </button>
          <button className="btn btn-success" onClick={submitQuiz} disabled={submitting}>
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
      </div>

      <div className="mb-5 p-4 rounded shadow border border-secondary">
        <h4 className="mb-4 text-info">📚 All Quizzes</h4>
        {quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <div key={quiz._id} className="d-flex justify-content-between align-items-center bg-secondary text-dark p-3 mb-2 rounded shadow-sm">
              <strong>{quiz.title}</strong>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteQuiz(quiz._id)}
              >
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted">No quizzes found.</p>
        )}
      </div>

      <hr className="border-secondary" />

      <div className="p-4 rounded shadow border border-secondary">
        <h4 className="mb-4 text-warning">📊 User Scores</h4>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead className="table-light text-dark">
              <tr>
                <th>👤 User</th>
                <th>📝 Quiz</th>
                <th>📈 Score</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.flatMap(user =>
                  user.scores.map((s, i) => (
                    <tr key={`${user._id}-${i}`}>
                      <td>{user.name}</td>
                      <td>{s.quizTitle}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {s.score} / {s.total}
                        </span>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No user scores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
