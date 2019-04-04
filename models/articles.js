const connection = require('../db/connection');

const fetchArticles = query => {
  const { author, topic, sort_by, order, article_id, limit, p } = query;
  return connection
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .from('articles')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit || 10)
    .offset(p || 0)
    .modify(articleQuery => {
      if (author) articleQuery.where({ author });
      if (topic) articleQuery.where({ topic });
      if (article_id)
        articleQuery.where('articles.article_id', '=', article_id);
    });
};

const updateArticleById = req => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*');

  // .select('votes')
  // .from('articles')
  // .where('article_id', '=', article_id)
  // .then(votes => {
  //   let currentVotes = votes[0].votes;
  //   return connection
  //     .select('*')
  //     .from('articles')
  //     .update('votes', inc_votes + currentVotes)
  //     .where('article_id', '=', article_id)
  //     .returning('*');
  // });
};

const deleteArticleById = params => {
  const { article_id } = params;
  return connection('articles')
    .where('article_id', '=', article_id)
    .del();
};

const fetchCommentsByArticleId = queriesAndParams => {
  const { article_id, sort_by, order } = queriesAndParams;
  return connection
    .select('comment_id', 'votes', 'created_at', 'body', 'username as author')
    .from('comments')
    .leftJoin('users', 'users.username', 'comments.created_by')
    .where('article_id', '=', article_id)
    .orderBy(sort_by || 'created_at', order || 'desc');
};

const postCommentByArticleId = req => {
  const { article_id } = req.params;
  const { body, username } = req.body;
  const created_at = new Date();

  const commentObject = {
    body: body,
    article_id: article_id,
    created_by: username,
    votes: 0,
    created_at: created_at.toISOString(),
  };

  return connection
    .insert(commentObject)
    .into('comments')
    .returning('*');
};

module.exports = {
  fetchArticles,
  updateArticleById,
  deleteArticleById,
  fetchCommentsByArticleId,
  postCommentByArticleId,
};
