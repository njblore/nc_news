const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const { routeNotFound, handleCustomErrors } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handleCustomErrors);

module.exports = app;
