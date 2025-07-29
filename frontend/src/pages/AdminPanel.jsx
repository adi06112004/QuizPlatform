import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [users, setUsers] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
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

    try {
      await fetch('http://localhost:5000/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz),
      });
      alert('✅ Quiz saved successfully!');
      setQuizTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (err) {
      console.error(err);
      alert('❌ Error saving quiz.');
    }
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">🛠️ Create New Quiz</h3>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Enter Quiz Title"
          value={quizTitle}
          onChange={e => setQuizTitle(e.target.value)}
        />
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="card mb-3 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Question {qIndex + 1}</h5>
            <input
              className="form-control mb-2"
              placeholder="Enter question"
              value={q.question}
              onChange={e => handleChange(qIndex, 'question', e.target.value)}
            />
            {q.options.map((opt, i) => (
              <input
                key={i}
                className="form-control mb-1"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => handleOptionChange(qIndex, i, e.target.value)}
              />
            ))}
            <input
              className="form-control mt-2"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={e => handleChange(qIndex, 'correctAnswer', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="mb-4">
        <button className="btn btn-outline-secondary me-2" onClick={addQuestion}>+ Add Question</button>
        <button className="btn btn-success" onClick={submitQuiz}>✅ Submit Quiz</button>
      </div>

      <hr />

      <h4 className="mt-5 mb-3">📊 User Scores</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">👤 User</th>
              <th scope="col">📝 Quiz</th>
              <th scope="col">📈 Score</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.flatMap(user =>
                user.scores.map((s, i) => (
                  <tr key={`${user._id}-${i}`}>
                    <td>{user.name}</td>
                    <td>{s.quizTitle}</td>
                    <td>{s.score} / {s.total}</td>
                  </tr>
                ))
              )
            ) : (
              <tr><td colSpan="3" className="text-center">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
