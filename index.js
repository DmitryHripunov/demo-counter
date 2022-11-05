require("dotenv").config();

const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const cookie = require('cookie');
const app = express();

const { findUserBySessionId } = require('./utils/findUserBySessionId');

const { knex } = require('./utils/knex');

const main = require('./routers/main');
const login = require('./routers/login');
const signup = require('./routers/signup');
const logout = require('./routers/logout');
const createTimer = require('./routers/createTimer');
const stopTimer = require('./routers/stopTimer');

const http = require('http');
const wss = require('./webSocket/wss');

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use('/', main);
app.use('/', login);
app.use('/', signup);
app.use('/', logout);

app.use('/api', createTimer);
app.use('/api', stopTimer);

const server = http.createServer(app);

server.on('upgrade', async (req, socket, head) => {
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

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
