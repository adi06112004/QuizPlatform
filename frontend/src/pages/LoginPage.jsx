import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double click
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://quizplatformbackend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('❌ Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#121212' }}
    >
      {/* Fullscreen loading overlay (optional) */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center z-3">
          <div className="spinner-border text-info" role="status" />
        </div>
      )}

      <div
        className="card text-white shadow-lg px-4 py-5"
        style={{ backgroundColor: '#1e1e1e', maxWidth: '400px', width: '100%' }}
      >
        <h3 className="text-center mb-4 fw-bold text-info">🔐 Login</h3>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control bg-dark text-white border-info"
              id="floatingEmail"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <label htmlFor="floatingEmail" className="text-secondary">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control bg-dark text-white border-info"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <label htmlFor="floatingPassword" className="text-secondary">Password</label>
          </div>

          <button
            type="submit"
            className="btn btn-info fw-semibold w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-center mb-0">
          <span className="">Don’t have an account? </span>
          <Link to="/signup" className="text-info text-decoration-none fw-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
