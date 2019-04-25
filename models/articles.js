const connection = require('../db/connection');

const fetchArticles = query => {
  const { author, topic, sort_by, order, article_id, limit, p } = query;

  return connection
    .select('*')
    .from('articles')
    .modify(articleQuery => {
      if (author) articleQuery.where({ author });
      if (topic) articleQuery.where({ topic });
      if (article_id)
        articleQuery.where('articles.article_id', '=', article_id);
    })
    .then(filteredArticles => {
      const total_count = filteredArticles.length;
      return connection
        .select('articles.*')
        .count({ comment_count: 'comment_id' })
        .from('articles')
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .modify(articleQuery => {
          if (author) articleQuery.where({ author });
          if (topic) articleQuery.where({ topic });
          if (article_id)
            articleQuery.where('articles.article_id', '=', article_id);
        })
        .limit(limit || 10)
        .offset(p || 0)
        .then(articles => {
          return { total_count, articles };
        });
    });
};

const updateArticleById = req => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  return connection('articles')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*');
};

const deleteArticleById = params => {
  const { article_id } = params;
  return connection('articles')
    .where('article_id', '=', article_id)
    .del();
};

const fetchCommentsByArticleId = queriesAndParams => {
  const { article_id, sort_by, order, limit, p } = queriesAndParams;
  return connection
    .select('comment_id', 'votes', 'created_at', 'body', 'username as author')
    .from('comments')
    .leftJoin('users', 'users.username', 'comments.created_by')
    .where('article_id', '=', article_id)
    .orderBy(sort_by || 'created_at', order || 'desc')
    .limit(limit || 10)
    .offset(p || 0);
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
  // .then(() => {
  //   return connection
  //     .select(
  //       'comment_id',
  //       'author',
  //       'comments.created_at',
  //       'comments.article_id',
  //       'comments.body',
  //       'comments.votes',
  //     )
  //     .from('comments')
  //     .where('comments.body', '=', body)
  //     .leftJoin('articles', 'comments.article_id', 'articles.article_id');
  // })
};

const postArticle = req => {
  const { author, title, topic, body } = req;

  const created_at = new Date();
  const articleObj = {
    author,
    title,
    topic,
    body,
    created_at: created_at.toISOString(),
  };

  return connection
    .insert(articleObj)
    .into('articles')
    .returning('*');
};

module.exports = {
  fetchArticles,
  updateArticleById,
  deleteArticleById,
  fetchCommentsByArticleId,
  postCommentByArticleId,
  postArticle,
};
