const commentsRouter = require('express').Router();
const {
  sendUpdatedComment,
  removeCommentById,
} = require('../controllers/comments');

commentsRouter
  .route('/:comment_id')
  .patch(sendUpdatedComment)
  .delete(removeCommentById);

module.exports = commentsRouter;
