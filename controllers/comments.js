const { updateCommentById, deleteCommentById } = require('../models/comments');

const sendUpdatedComment = (req, res, next) => {
  if (!req.body.inc_votes) {
    next({ code: '42703' });
  } else if (Object.keys(req.body) !== ['inc_votes']) {
    next({ code: '42703' });
  } else {
    updateCommentById(req)
      .then(([comment]) => {
        res.status(200).send({ comment });
      })
      .catch(next);
  }
};

const removeCommentById = (req, res, next) => {
  deleteCommentById(req.params)
    .then(() => {
      res.status(200).send({
        msg: `Comment with id ${req.params.comment_id} has been removed.`,
      });
    })
    .catch(next);
};

module.exports = { sendUpdatedComment, removeCommentById };
