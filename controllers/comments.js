const { updateCommentById } = require('../models/comments');

const sendUpdatedComment = (req, res, next) => {
  updateCommentById(req)
    .then(comment => {
      comment = comment[0];
      res.status(200).send({ comment });
    })
    .catch(console.log);
};

module.exports = { sendUpdatedComment };
