require("dotenv").config();

const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");

const app = express();

const main = require('./routers/main');
const login = require('./routers/login');
const signup = require('./routers/signup');
const logout = require('./routers/logout');
const createTimer = require('./routers/createTimer');
const stopTimer = require('./routers/stopTimer');

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

const http = require('http');
const server = http.createServer(app);
const wssConnect = require('./webSocket/wssConnect');

wssConnect(server);

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
