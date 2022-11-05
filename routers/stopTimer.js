const express = require('express');
const stopTimer = express.Router();

const { knex } = require('../utils/knex');

stopTimer.route('/timers/:id/stop').post(async (req, res) => {
  if (!req.params.id) {
    return res.redirect("/");
  }

  try {
    const timerId = req.params.id;
    const timerStop = await knex("timers").select({ start: "start" }).where({ id: timerId }).update({
      isActive: false,
      end: Date.now(),
    });

    if (timerStop) {
      res.json({
        timerStop,
      });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = stopTimer;
