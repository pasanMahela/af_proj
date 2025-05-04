const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.favorites);
});

router.post('/', auth, async (req, res) => {
  const { code } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(code)) {
    user.favorites.push(code);
    await user.save();
  }
  res.json(user.favorites);
});

router.delete('/:code', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter(c => c !== req.params.code);
  await user.save();
  res.json(user.favorites);
});

module.exports = router;
