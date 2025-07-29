// File: src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFound from './pages/NotFound';

const App = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={
            user ? (
              user.email === 'admin@example.com'
                ? <Navigate to="/admin" />
                : <Navigate to="/quiz" />
            ) : (
              <Navigate to="/login" />
            )
          } />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />

          <Route path="/quiz" element={
            user && user.email !== 'admin@example.com'
              ? <QuizPage />
              : <Navigate to="/login" />
          } />

          <Route path="/admin" element={
            user && user.email === 'admin@example.com'
              ? <AdminPanel />
              : <Navigate to="/login" />
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
