const express = require('express');
const app = express();
const cors = require('cors');
const apiRouter = require('./routes/api');
const {
  routeNotFound,
  handleCustomErrors,
  handleSQLErrors,
  handle500,
} = require('./errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handleCustomErrors);

app.use(handleSQLErrors);

app.use(handle500);

module.exports = app;
