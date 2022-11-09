const WebSocket = require('ws');
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
const clients = new Map();

const { knex } = require('../utils/knex');

wss.on('connection', async (ws, req) => {
  const { user } = req;

  clients.set(user, ws);

  ws.on('close', () => {
    clients.delete(user);
  });

  const userTimers = await knex("timers").select().where({ user_id: user.id });

  const activeTimers = userTimers.filter((timer) => {
    if (timer.isActive === true) {
      timer.progress = Date.now() - timer.start;
      timer.start = Number(timer.start);
      return timer;
    }
  });

  const oldTimers = userTimers.filter((timer) => {
    if (timer.isActive === false) {
      timer.start = Number(timer.start);
      timer.end = Number(timer.end);
      timer.duration = Number(timer.end - timer.start);
      return timer;
    }
  });

  try {
    const allTimers = JSON.stringify({
      type: 'all_timers',
      activeTimers,
      oldTimers,
    });
    ws.send(allTimers)
  } catch (err) { console.log(err) }

  try {
    setInterval(() => {
      const payloadTimers = JSON.stringify({
        type: 'active_timers',
        activeTimers: userTimers.filter((timer) => {
          if (timer.isActive === true) {
            timer.progress = Date.now() - timer.start;
            timer.start = Number(timer.start);
            return timer;
          }
        }),
      });
      ws.send(payloadTimers)
    }, 1000);
  } catch (err) { console.log(err) }
});

module.exports = wss;
