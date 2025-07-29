const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz_app';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Mongo Error:', err));

// ------------------ Models ------------------

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  scores: [
    {
      quizId: String,
      quizTitle: String,
      score: Number,
      total: Number,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});
const User = mongoose.model('User', userSchema);

// Quiz schema
const quizSchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String
    }
  ]
});
const Quiz = mongoose.model('Quiz', quizSchema);

// ------------------ Routes ------------------

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const user = new User({ name, email, password });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// Login
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ name: 'Admin', email: ADMIN_EMAIL });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ _id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});



// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
});

// Create a quiz
app.post('/api/quizzes', async (req, res) => {
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.status(201).json(quiz);
});

// Submit quiz score
app.post('/api/submit-score', async (req, res) => {
  const { userId, quizId, quizTitle, score, total } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.scores.push({ quizId, quizTitle, score, total });
  await user.save();
  res.json({ message: 'Score recorded' });
});

// Get all users with scores (Admin only)
app.get('/api/users', async (req, res) => {
  const users = await User.find({}, 'name scores');
  res.json(users);
});

// Delete quiz (optional)
app.delete('/api/quizzes/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Quiz not found' });
  }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
