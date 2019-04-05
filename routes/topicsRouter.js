const topicsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const { sendTopics, postTopic } = require('../controllers/topics');

topicsRouter
  .route('/')
  .get(sendTopics)
  .post(postTopic)
  .all(methodNotAllowed);

module.exports = topicsRouter;
