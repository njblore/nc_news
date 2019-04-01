const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const { routeNotFound, handle500 } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handle500);

module.exports = app;
