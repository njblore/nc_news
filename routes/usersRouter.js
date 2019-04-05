const usersRouter = require('express').Router();
const {
  sendUser,
  postNewUser,
  sendAllUsers,
  sendUpdatedUser,
} = require('../controllers/users');
const { methodNotAllowed } = require('../errors');

usersRouter
  .route('/')
  .post(postNewUser)
  .get(sendAllUsers)
  .all(methodNotAllowed);

usersRouter
  .route('/:username')
  .get(sendUser)
  .patch(sendUpdatedUser)
  .all(methodNotAllowed);

module.exports = usersRouter;
