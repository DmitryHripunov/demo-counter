const express = require("express");
const createTimer = express.Router();

const { auth } = require('../utils/auth');
const { knex } = require('../utils/knex');

createTimer.route('/timers').post(auth, async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  }

  const dateStart = Date.now();

  try {
    const userId = await req.user.id;

    const newTimer = {
      description: req.body.description,
      isActive: true,
      start: dateStart,
      user_id: userId,
    };

    await knex("timers").insert(newTimer);

    return res.json({ newTimer });
  } catch (err) {
    console.log(err.message);
    return res.json({});
  }
});

module.exports = createTimer;
