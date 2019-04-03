const connection = require('../db/connection');

const updateCommentById = req => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;

  return connection('comments')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*');
};

const deleteCommentById = params => {
  const { comment_id } = params;
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del();
};

module.exports = { updateCommentById, deleteCommentById };
