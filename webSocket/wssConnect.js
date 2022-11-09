
const cookie = require('cookie');
const { findUserBySessionId } = require('../utils/findUserBySessionId');
const { knex } = require('../utils/knex');
const wss = require('./wss');

const wssConnect = (serve) => serve.on('upgrade', async (req, socket, head) => {
  const cookies = cookie.parse(req.headers['cookie'])
  const token = cookies && cookies['sessionId'];
  const user = token && await findUserBySessionId(token, knex);

  if (!user) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy();
    return;
  }

  req.user = user;
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req)
  });
});

module.exports = wssConnect;
