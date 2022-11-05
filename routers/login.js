const express = require('express');
const login = express.Router();

const { findUserByUserName } = require('../utils/findUserByUserName');
const { createSession } = require('../utils/createSession');
const bodyParser = require('body-parser');
const { hash } = require('../utils/hash');

login.route('/login').post(bodyParser.urlencoded({ extended: false }), async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUserName(username);

    const shaPassword = hash(password);

    if (!user || user.password !== shaPassword) {
      return res.redirect('/?authError=true');
    }

    const sessionId = await createSession(user.id);

    res
      .cookie('sessionId', sessionId, {
        httpOnly: true,
        expires: 0,
      })
      .redirect('/');
  } catch (err) {
    console.error(err);
  }
});

module.exports = login;
