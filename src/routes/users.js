const express = require('express');
const User = require('../models/User');

const router = new express.Router();

router.get('/user/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      res.status(404).json({
        msg: 'User not found',
      });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/sign', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({ msg: 'enter full infos' });
    }
    const user = await User.create({ email, password });
    const token = user.generateJWT();
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ msg: 'invalid credintials' });
    }
    const token = user.generateJWT();
    res.status(200).json({ user, token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
