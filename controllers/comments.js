const { updateCommentById, deleteCommentById } = require('../models/comments');

const sendUpdatedComment = (req, res, next) => {
  updateCommentById(req)
    .then(comment => {
      comment = comment[0];
      res.status(200).send({ comment });
    })
    .catch(console.log);
};

const removeCommentById = (req, res, next) => {
  deleteCommentById(req.params).then(() => {
    res.status(200).send({
      msg: `Comment with id ${req.params.comment_id} has been removed.`,
    });
  });
};

module.exports = { sendUpdatedComment, removeCommentById };
