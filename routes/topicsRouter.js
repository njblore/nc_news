const topicsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics } = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(sendTopics)
  .all(methodNotAllowed);

module.exports = topicsRouter;
