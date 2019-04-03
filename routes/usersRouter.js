const usersRouter = require('express').Router();
const { sendUser } = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/:username')
  .get(sendUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
