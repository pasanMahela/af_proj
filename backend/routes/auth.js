const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: 'User exists' });

    // Hashing is handled in your User model pre-save
    const user = new User({ username, password });
    await user.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie for cross-site use
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'None',   // ← allow cross-site
      secure: true,       // ← only over HTTPS in prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user from cookie
router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(null);

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    res.json(data);
  } catch {
    res.clearCookie('token');
    res.json(null);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }).json({ message: 'Logged out' });
});

module.exports = router;
