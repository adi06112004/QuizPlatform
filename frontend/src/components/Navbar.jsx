// File: src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Quiz App</Link>

      <div className="collapse navbar-collapse justify-content-end">
        {!user ? (
          <div className="d-flex">
            <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
            <Link className="btn btn-light" to="/signup">Signup</Link>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <span className="text-white me-3">👤 {user.name}</span>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
