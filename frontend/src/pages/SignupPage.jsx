import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      alert('✅ Signup successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setLoading(false);
      setError('❌ Server error. Please try again.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', backgroundColor: '#121212' }}
    >
      <div
        className="card text-white shadow-lg px-4 py-5"
        style={{ backgroundColor: '#1e1e1e', maxWidth: '420px', width: '100%' }}
      >
        <h3 className="text-center mb-4 fw-bold text-info">📝 Create Account</h3>

        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control bg-dark text-white border-info"
              id="floatingName"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="floatingName" className="text-secondary">Full Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control bg-dark text-white border-info"
              id="floatingEmail"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingEmail" className="text-secondary">Email address</label>
          </div>

          <div className="form-floating mb-2 position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control bg-dark text-white border-info"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <label htmlFor="floatingPassword" className="text-secondary">Password</label>

            <button
              type="button"
              className="btn btn-sm btn-outline-light position-absolute"
              style={{ top: '50%', right: '10px', transform: 'translateY(-50%)' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="mb-3" style={{ fontSize: '0.85rem' }}>
            🔒 Use at least 6 characters with a mix of letters and numbers.
          </div>

          <button
            type="submit"
            className="btn btn-info fw-semibold w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <hr className="my-4 border-light" />

        <p className="text-center mb-0">
          <span className="">Already have an account? </span>
          <Link to="/login" className="text-info text-decoration-none fw-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
