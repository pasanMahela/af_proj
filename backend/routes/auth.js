const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ message: 'User exists' });

  const user = new User({ username, password });
  await user.save();

  res.status(201).json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET);
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false // Set to true if using HTTPS
  }).json({ message: 'Login successful' });
});

router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(null);

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    res.json(data);
  } catch {
    res.json(null);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

module.exports = router;
