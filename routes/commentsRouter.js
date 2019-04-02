const commentsRouter = require('express').Router();
const { methodNotAllowed } = require('../errors');
const {
  sendUpdatedComment,
  removeCommentById,
} = require('../controllers/comments');

commentsRouter
  .route('/:comment_id')
  .patch(sendUpdatedComment)
  .delete(removeCommentById)
  .all(methodNotAllowed);

module.exports = commentsRouter;
