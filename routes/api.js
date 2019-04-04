const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const articleRouter = require('./articleRouter');
const commentsRouter = require('./commentsRouter');
const usersRouter = require('./usersRouter');
const { methodNotAllowed } = require('../errors');
const endpoints = require('./endpoints');

apiRouter
  .route('/')
  .get((req, res) => res.status(200).send(endpoints))
  .all(methodNotAllowed);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
