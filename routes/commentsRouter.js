const commentsRouter = require('express').Router();
const { sendUpdatedComment } = require('../controllers/comments');

commentsRouter.route('/:comment_id').patch(sendUpdatedComment);

module.exports = commentsRouter;
