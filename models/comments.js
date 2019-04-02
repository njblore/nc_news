const connection = require('../db/connection');

const updateCommentById = req => {
  console.log('updating comment');
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  return connection
    .select('votes')
    .from('comments')
    .where('comment_id', '=', comment_id)
    .then(votes => {
      let currentVotes = votes[0].votes;
      return connection
        .select('*')
        .from('comments')
        .where('comment_id', '=', comment_id)
        .update('votes', currentVotes + inc_votes)
        .returning('*');
    });
};

const deleteCommentById = params => {
  const { comment_id } = params;
  return connection('comments')
    .where('comment_id', '=', comment_id)
    .del();
};

module.exports = { updateCommentById, deleteCommentById };
