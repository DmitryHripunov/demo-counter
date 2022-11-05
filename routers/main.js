const express = require('express');
const main = express.Router();

const { auth } = require('../utils/auth');

main.route('/').get(auth, (req, res) => {
  return res.render('index', {
    user: req.user,
    authError: req.query.authError === 'true' ? 'Wrong username or password' : req.query.authError,
    signError: req.query.signError === 'true' ? 'User is exist try Login' : req.query.signError,
  });
});

module.exports = main;
