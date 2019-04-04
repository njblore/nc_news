const { updateCommentById, deleteCommentById } = require('../models/comments');

const sendUpdatedComment = (req, res, next) => {
  if (!req.body.inc_votes) {
    req.body.inc_votes = 0;
  }
  updateCommentById(req)
    .then(([comment]) => {
      if (!comment) {
        next({ status: 404, msg: 'Comment Not Found' });
      } else {
        res.status(200).send({ comment });
      }
    })
    .catch(next);
};

const removeCommentById = (req, res, next) => {
  deleteCommentById(req.params)
    .then(numOfDeletions => {
      if (!numOfDeletions) {
        next({ status: 404, msg: 'Comment Not Found' });
      } else {
        res.status(200).send({
          msg: `Comment with id ${req.params.comment_id} has been removed.`,
        });
      }
    })
    .catch(next);
};

module.exports = { sendUpdatedComment, removeCommentById };
