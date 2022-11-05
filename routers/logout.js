const express = require('express');
const logout = express.Router();

const { auth } = require('../utils/auth');
const { deleteSession } = require('../utils/deleteSession');

logout.route('/logout').get(auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    await deleteSession(req.sessionId);

    res.clearCookie('sessionId').redirect('/');
  } catch (err) {
    console.error(err);
  }
});

module.exports = logout;
