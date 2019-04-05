const usersRouter = require('express').Router();
const { sendUser, postNewUser, sendAllUsers } = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .post(postNewUser)
  .get(sendAllUsers)
  .all(methodNotAllowed);

usersRouter
  .route('/:username')
  .get(sendUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
